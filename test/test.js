
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

var expression = new ajlogo.CompositeExpression([1, 2, 3]);
assert.equal(3, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.Procedure('add'), 2, 3]);
assert.equal(5, expression.evaluate(ctx));


