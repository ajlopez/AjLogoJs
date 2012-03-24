
(function(exports)
{
    function Context()
    {
		this.variables = [];
		this.procedures = [];
    }

    Context.prototype.setVariable = function(name, value)
    {
        this.variables[name] = value;
    }

    Context.prototype.getVariable = function(name)
    {
        return this.variables[name];
    }
	
	Context.prototype.setProcedure = function(name, value)
	{
		this.procedures[name] = value;
	}
	
	Context.prototype.getProcedure = function(name)
	{
		return this.procedures[name];
	}

    function List(first, rest)
    {
        this.first = first;
        this.rest = rest;
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
			var result = evaluateElement();
			
		return result;
		
		function evaluateElement()
		{
			var element = self.list[ip++];
			
			if (element.evaluate)
				element = element.evaluate(context);
				
			if (!element.apply)
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

    exports.Context = Context;
    exports.List = List;
	exports.CompositeExpression = CompositeExpression;
	exports.VariableReference = VariableReference;
	exports.ProcedureReference = ProcedureReference;
	exports.Constant = Constant;
	
	exports.compileList = compileList;
	exports.evaluateList = evaluateList;

})(typeof exports == "undefined" ? this['ajlogo'] = {} : exports);

