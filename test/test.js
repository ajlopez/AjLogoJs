
var assert = require('assert');
var ajlogo = require('../lib/ajlogo.js');

// Context

var ctx = new ajlogo.Context();

assert.ok(ctx);

assert.equal(null, ctx.getVariable('foo'));

ctx.setVariable('foo', 'bar');
assert.equal('bar', ctx.getVariable('foo'));

var list = new ajlogo.List(1, null);
assert.equal(1, list.first);
assert.equal(null, list.rest);

ctx.setProcedure('add', function(x, y) { return x + y; });

var add = ctx.getProcedure('add');

// Evaluate Composite Expression

var expression = new ajlogo.CompositeExpression([1, 2, 3]);
assert.equal(3, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('add'), 2, 3]);
assert.equal(5, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('add'), 2, 3, new ajlogo.ProcedureReference('add'), 4, 5]);
assert.equal(9, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('add'), 2, new ajlogo.ProcedureReference('add'), 4, 5]);
assert.equal(11, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('add'), "foo", "bar"]);
assert.equal("foobar", expression.evaluate(ctx));

ctx.setVariable('one', 1);
ctx.setVariable('two', 2);

var one = new ajlogo.VariableReference('one');
var two = new ajlogo.VariableReference('two');

assert.equal(1, one.evaluate(ctx));
assert.equal(2, two.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('add'), one, two]);
assert.equal(3, expression.evaluate(ctx));

// Compile List

list = ajlogo.compileList([1, 2, 3]);
assert.ok(list);
assert.equal(3, list.length);
assert.equal(1, list[0]);
assert.equal(2, list[1]);
assert.equal(3, list[2]);

list = ajlogo.compileList(['add', 1, 2]);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));

list = ajlogo.compileList(['add', '"foo', '"bar']);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal("foobar", (new ajlogo.CompositeExpression(list)).evaluate(ctx));

list = ajlogo.compileList(['add', ':one', ':two']);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));

// Evaluate List

assert.equal(3, ajlogo.evaluateList([1,2,3], ctx));
assert.equal('foobar', ajlogo.evaluateList(['add','"foo','"bar'], ctx));
assert.equal(3, ajlogo.evaluateList(['add',':one',':two'], ctx));

