
var assert = require('assert');
var ajlogo = require('../lib/ajlogo.js');

// Context

var ctx = ajlogo.TopContext;

assert.ok(ctx);

assert.equal(null, ctx.getVariable('foo'));

ctx.setVariable('foo', 'bar');
assert.equal('bar', ctx.getVariable('foo'));

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

// Compile text

result = ajlogo.compileText("add");
assert.ok(result);
assert.equal(1, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);

result = ajlogo.compileText("add 1 2");
assert.ok(result);
assert.equal(3, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);
assert.equal(1, result[1]);
assert.equal(2, result[2]);

result = ajlogo.compileText("add :one :two");
assert.ok(result);
assert.equal(3, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);
assert.ok(result[1] instanceof ajlogo.VariableReference);
assert.ok(result[2] instanceof ajlogo.VariableReference);

result = ajlogo.compileText('make "three 3');
assert.ok(result);
assert.equal(3, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);
assert.equal("three", result[1]);
assert.equal(3, result[2]);

// Primitives

assert.ok(ctx.getProcedure('add'));
assert.ok(ctx.getProcedure('make'));
assert.ok(ctx.getProcedure('word'));

result = ajlogo.compileText('make "three 3');
(new ajlogo.CompositeExpression(result)).evaluate(ctx);
assert.equal(3, ctx.getVariable('three'));

result = ajlogo.compileText('add 1 2');
assert.equal(1, result[1]);
assert.equal(2, result[2]);
assert.equal(3, ajlogo.evaluateText('add 1 2', ctx));
assert.equal(3, ajlogo.evaluateText('add 1 2'));

assert.equal(null, ajlogo.evaluateText('make "four 3', ctx));

// To

assert.ok(ctx.getProcedure('to'));

ajlogo.evaluateText('to setfoo make "foo "bar end');
result = ctx.getProcedure('setfoo');
assert.ok(result);

