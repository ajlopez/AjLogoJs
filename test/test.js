
var assert = require('assert');
var ajlogo = require('../lib/ajlogo.js');


// Context

var ctx = new ajlogo.Context();

assert.ok(ctx);

assert.equal(null, ctx.get('foo'));

ctx.set('foo', 'bar');
assert.equal('bar', ctx.get('foo'));

var list = new ajlogo.List(1, null);
assert.equal(1, list.first);
assert.equal(null, list.rest);

ctx.set('add', function(x, y) { return x + y; });

var add = ctx.get('add');

var array = [add, 2, 3];

assert.equal(5, array.evaluate(ctx));

