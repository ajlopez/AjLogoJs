
global.testing = true;
var ajlogo = require('..');

exports['evaluate composite expression'] = function (test) {
    var ctx = ajlogo.TopContext;

    var expression = new ajlogo.CompositeExpression([1, 2, 3]);
    test.equal(3, expression.evaluate(ctx));

    expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, 3]);
    test.equal(5, expression.evaluate(ctx));

    expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, 3, new ajlogo.ProcedureReference('sum'), 4, 5]);
    test.equal(9, expression.evaluate(ctx));

    expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, new ajlogo.ProcedureReference('sum'), 4, 5]);
    test.equal(11, expression.evaluate(ctx));

    expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), "foo", "bar"]);
    test.equal("foobar", expression.evaluate(ctx));
}

exports['evaluate composite expression using variables'] = function (test) {
    var ctx = ajlogo.TopContext;
    
    ctx.setVariable('one', 1);
    ctx.setVariable('two', 2);

    var one = new ajlogo.VariableReference('one');
    var two = new ajlogo.VariableReference('two');

    test.equal(1, one.evaluate(ctx));
    test.equal(2, two.evaluate(ctx));

    expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), one, two]);
    test.equal(3, expression.evaluate(ctx));
}

