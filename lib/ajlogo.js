
(function(exports)
{
    function Context()
    {
    
    }

    Context.prototype.set = function(name, value)
    {
        this[name] = value;
    }

    Context.prototype.get = function(name)
    {
        return this[name];
    }

    function List(first, rest)
    {
        this.first = first;
        this.rest = rest;
    }   

    Array.prototype.evaluate = function(context)
    {        
        var func = this.evaluateFirst(context);
        var args = this.evaluateRest(context);
        if (func.apply)
            return func.apply(null, args);
        return args.unshift(func);
    }

    Array.prototype.evaluateFirst = function(context)
    {
        var first = this[0];
        if (first.evaluate)
            return first.evaluate(context);
        return first;
    }

    Array.prototype.evaluateRest = function(context)
    {
        var l = this.length;

        if (l < 2)
            return null;

        var result = new Array(l-1);

        for (var k = 1; k < l ; k++)
            result[k-1] = this[k].evaluate ? this[k].evaluate(context) : this[k];

        return result;
    }

    exports.Context = Context;
    exports.List = List;

})(typeof exports == "undefined" ? this['ajlogo'] = {} : exports);
