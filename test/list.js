
global.testing = true;
var ajlogo = require('..');

exports['compile list'] = function (test) {
    var ctx = ajlogo.TopContext;
    
    list = ajlogo.compileList([1, 2, 3]);
    test.ok(list);
    test.equal(3, list.length);
    test.equal(1, list[0]);
    test.equal(2, list[1]);
    test.equal(3, list[2]);

    list = ajlogo.compileList([false, true]);
    test.ok(list);
    test.equal(2, list.length);
    test.equal(false, list[0]);
    test.equal(true, list[1]);

    list = ajlogo.compileList(['sum', 1, 2]);
    test.ok(list[0] instanceof ajlogo.ProcedureReference);
    test.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));

    list = ajlogo.compileList(['sum', '"foo', '"bar']);
    test.ok(list[0] instanceof ajlogo.ProcedureReference);
    test.equal("foobar", (new ajlogo.CompositeExpression(list)).evaluate(ctx));

    ctx.setVariable('one', 1);
    ctx.setVariable('two', 2);

    list = ajlogo.compileList(['sum', ':one', ':two']);
    test.ok(list[0] instanceof ajlogo.ProcedureReference);
    test.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));
}

exports['evaluate list'] = function (test) {
    var ctx = ajlogo.TopContext;

    ctx.setVariable('one', 1);
    ctx.setVariable('two', 2);
    
    test.equal(3, ajlogo.evaluateList([1,2,3], ctx));
    test.equal('foobar', ajlogo.evaluateList(['sum','"foo','"bar'], ctx));
    test.equal(3, ajlogo.evaluateList(['sum',':one',':two'], ctx));
}

