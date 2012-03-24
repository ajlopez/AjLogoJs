
(function(exports)
{
    function Context(parent)
    {
		this.variables = [];
		this.procedures = [];
		this.parent = parent;
    }

    Context.prototype.setVariable = function(name, value)
    {
        this.variables[name] = value;
    }

    Context.prototype.getVariable = function(name)
    {
		if (!this.variables.hasOwnProperty(name) && this.parent != null)
			return this.parent.getVariable(name);
			
        return this.variables[name];
    }
	
	Context.prototype.setProcedure = function(name, value)
	{
		this.procedures[name] = value;
	}
	
	Context.prototype.getProcedure = function(name)
	{
		if (!this.procedures.hasOwnProperty(name) && this.parent != null)
			return this.parent.getProcedure(name);
			
		if (this.procedures[name] == null)
			console.log(name);
			
		return this.procedures[name];
	}

	function ProcedureReference(name)
	{
		this.name = name;
	}
	
	ProcedureReference.prototype.evaluate = function(context)
	{
		return context.getProcedure(this.name);
	}
	
	function Constant(value)
	{
		this.value = value;
	}
	
	Constant.prototype.evaluate = function(context)
	{
		return this.value;
	}
	
	function VariableReference(name)
	{
		this.name = name;
	}
	
	VariableReference.prototype.evaluate = function(context)
	{
		return context.getVariable(this.name);
	}
	
	function CompositeExpression(list)
	{
		this.list = list;
	}
	
	CompositeExpression.prototype.evaluate = function(context)
	{
		var ip = 0;
		var l = this.list.length;
		var self = this;
		
		while (ip < l)
		{
			var result = evaluateElement();
			
			if (result && result instanceof ReturnValue)
				return result;
		}
			
		return result;
		
		function evaluateElement()
		{
			var element = self.list[ip++];
			
			if (element.evaluate)
				element = element.evaluate(context);
				
			if (!element.apply)
				if (element.special)
				{
					var refip = { ip: ip };
					element.special(self.list, refip);
					ip = refip.ip;
					return;
				}
				else if (element.process)
				{
					var args = [];
					var l = element.length;
					
					for (var k = 0; k < l; k++)
						args.push(evaluateElement());
						
					return element.process(context, args);
				}
				else
					return element;
				
			if (!element.length)
				return element.apply();
				
			var args = [];
			var l = element.length;
			
			for (var k = 0; k < l; k++)
				args.push(evaluateElement());
				
			return element.apply(null, args);
		}
	}
	
	function compileList(list)
	{
		var result = [];
		var l = list.length;
		
		for (var k = 0; k < l; k++)
		{
			var element = list[k];
			
			if (element instanceof Array)
				element = compileList(list);
			else if (isProcedureReference(element))
				element = new ProcedureReference(element);
			else if (isVariableReference(element))
				element = new VariableReference(toVariableName(element));
			else if (isWord(element))
				element = toWord(element);
				
			result.push(element);
		}
		
		return result;
	}
	
	function isProcedureReference(element)
	{
		var letter = element[0];
		
		if (letter >= 'a' && letter <= 'z')
			return true;
		if (letter >= 'A' && letter <= 'Z')
			return true;
			
		return false;
	}
	
	function isVariableReference(element)
	{
		return element[0] == ':';		
	}
	
	function toVariableName(element)
	{
		return element.slice(1);
	}
	
	function isWord(element)
	{
		return element[0] == '"';
	}
	
	function toWord(element)
	{
		return element.slice(1);
	}
	
	function evaluateList(list, context)
	{
		return (new CompositeExpression(compileList(list))).evaluate(context);
	}
	
	// Procedure
	
	function Procedure(argnames, body)
	{
		this.argnames = argnames;
		this.body = body;
		this.length = argnames ? argnames.length : 0;
	}
	
	Procedure.prototype.process = function(context, args)
	{
		var newctx = new Context(context);
		
		if (this.argnames && this.argnames.length)
			for (var n in this.argnames)
				newctx.setVariable(this.argnames[n], args[n]);
				
		var result  = (new CompositeExpression(this.body)).evaluate(newctx);
		
		return result ? result.returnValue : null;
	}
	
	// to processor
	
	var to = {};
	
	to.special = function(list, refip)
	{
		var name = list[refip.ip].name;		
		var argnames = [];
		
		for (var k = refip.ip+1; list[k] instanceof VariableReference; k++)
			argnames.push(list[k].name);
			
		var initial = k;
		
		for (; !(list[k] instanceof ProcedureReference) || list[k].name != 'end'; k++)
			;
		
		refip.ip = k + 1;
		
		var body = list.slice(initial, k);		
		
		var procedure = new Procedure(argnames, body);
		topcontext.setProcedure(name, procedure);
	}
	
	// Lexer
	
	function Lexer(text) 
	{
		var position = 0;
		var length = text.length;
		var lasttoken = null;
		
		var separators = '()[]';
		var operators = '+-*/=<>';
		
		this.nextToken = function() {
			if (lasttoken != null) {
				var value = lasttoken;
				lasttoken = null;
				return value;
			}
		
			skipSpaces();
			
			var char = nextChar();
			
			if (char == null)
				return null;
			
			if (isLetter(char))
				return nextName(char);
				
			if (isDigit(char))
				return nextNumber(char);
				
			if (char == '"')
				return nextWord();

			if (char == ':')
				return nextVariable();
				
			return new Token(char, TokenType.Separator);
		}
		
		this.pushToken = function(token) 
		{
			lasttoken = token;
		}
		
		function nextChar()
		{
			if (position > length)
				return null;
				
			return text[position++];
		}
		
		function skipSpaces()
		{
			while (position < length && text[position] <= ' ')
				position++;
		}
		
		function nextName(char)
		{
			var name = char;
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0 && operators.indexOf(char) < 0)
				name += char;
				
			if (char != null)
				position--;
				
			return new Token(name, TokenType.Name);
		}
		
		function nextVariable()
		{
			var name = '';
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0 && operators.indexOf(char) < 0)
				name += char;
				
			if (char != null)
				position--;
				
			return new Token(name, TokenType.Variable);
		}
		
		function nextWord()
		{
			var word = '';
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0)
				word += char;
				
			if (char != null)
				position--;
				
			return new Token(word, TokenType.Word);
		}
		
		function nextNumber(char)
		{
			var number = char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char == '.')
				return nextFloatNumber(number+'.');
				
			if (char != null)
				position--;
				
			return new Token(parseInt(number), TokenType.Number);
		}
		
		function nextFloatNumber(number)
		{
			var char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char != null)
				position--;
				
			return new Token(parseFloat(number), TokenType.Number);
		}
		
		function isLetter(char)
		{
			if (char >= 'a' && char <= 'z')
				return true;
				
			if (char >= 'A' && char <= 'Z')
				return true;
				
			return false;
		}
		
		function isDigit(char)
		{
			if (char >= '0' && char <= '9')
				return true;
				
			return false;
		}
	}
	
	function Token(value, type)
	{
		this.value = value;
		this.type = type;
	}
	
	var TokenType = { Name: 0, Number:1, Separator:2, Word:3, Variable:4 };
	
	// Parser
	
	function Parser(lexer) 
	{
		this.parse = parse;
		
		function parse(upto) {
			var result = [];
			
			for (var token = lexer.nextToken(); token != null; token = lexer.nextToken())
			{
				if (upto != null && token.type == TokenType.Separator && token.value == upto)
					return result;

					result.push(parseElement(token));
			}
			
			if (upto != null)
				throw "Expected '" + upto + "'";
			
			return result;
		}
		
		function parseElement(token)
		{
			if (token.type == TokenType.Word)
				return token.value;
				
			if (token.type == TokenType.Number)
				return token.value;
				
			if (token.type == TokenType.Name)
				return new ProcedureReference(token.value);
				
			if (token.type == TokenType.Variable)
				return new VariableReference(token.value);
		}
	}
	
	function compileText(text)
	{
		var lexer = new Lexer(text);
		var parser = new Parser(lexer);
		return parser.parse();
	}
	
	function evaluateText(text, context)
	{
		var list = compileText(text);
		return (new CompositeExpression(list)).evaluate(context ? context : topcontext);
	}
	
	var topcontext = new Context();
	
	// Return value
	
	function ReturnValue(value)
	{
		this.returnValue = value;
	}
	
	// Primitives
	
	topcontext.setProcedure('make', function(name, value) {
		topcontext.setVariable(name, value);
	});
	
	topcontext.setProcedure('add', function(x, y) {
		return x+y;
	});
	
	topcontext.setProcedure('word', function(x, y) {
		return x+ ' ' + y;
	});
	
	topcontext.setProcedure('to', to);
	
	topcontext.setProcedure('output', function(value) {
		return new ReturnValue(value);
	});

	// Exports

    exports.TopContext = topcontext;
	exports.Context = Context;
	exports.CompositeExpression = CompositeExpression;
	exports.VariableReference = VariableReference;
	exports.ProcedureReference = ProcedureReference;
	exports.Constant = Constant;
	
	exports.compileList = compileList;
	exports.evaluateList = evaluateList;
	exports.compileText = compileText;
	exports.evaluateText = evaluateText;

})(typeof exports == "undefined" ? this['ajlogo'] = {} : exports);

