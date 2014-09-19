
global.testing = true;
var ajlogo = require('../lib/ajlogo.js');

exports['Context'] = function(test) {
	var ctx = ajlogo.TopContext;

	test.ok(ctx);

	test.equal(null, ctx.getVariable('foo'));

	ctx.setVariable('foo', 'bar');
	test.equal('bar', ctx.getVariable('foo'));
	
	test.done();
}

// Nested Context

exports['Nested Context'] = function(test) {
	var ctx = ajlogo.TopContext;
	var newctx = new ajlogo.Context(ctx);

	test.ok(ctx.getProcedure('make'));
	test.ok(newctx.getProcedure('make'));

	ctx.setVariable('a', 1);
	newctx.setVariable('a', 2);

	test.equal(2, ctx.getVariable('a'));
	test.equal(2, newctx.getVariable('a'));

	ctx.setVariable('b', 1);
	newctx.defineVariable('b');
	newctx.setVariable('b', 2);

	test.equal(1, ctx.getVariable('b'));
	test.equal(2, newctx.getVariable('b'));

	newctx.setVariable('c', 3);

	test.equal(3, ctx.getVariable('c'));
	test.equal(3, newctx.getVariable('c'));
	
	test.done();
}
