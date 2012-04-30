
global.testing = true;
var ajlogo = require('../lib/ajlogo.js');

exports['wordp, listp, numberp'] = function(test) {
	test.ok(ajlogo.evaluateText('numberp 1'));
	test.ok(ajlogo.evaluateText('wordp "foo'));
	test.ok(ajlogo.evaluateText('listp [1 2 3]'));
	test.ok(!ajlogo.evaluateText('numberp "foo'));
	test.ok(!ajlogo.evaluateText('wordp [1 2 3]'));
	test.ok(!ajlogo.evaluateText('listp 1'));

	test.done();
}

exports['equalp, notequalp'] = function(test) {
	test.ok(ajlogo.evaluateText('equalp 1 1'));
	test.ok(ajlogo.evaluateText('equalp "a "a'));
	test.ok(ajlogo.evaluateText('equalp [1 2] [1 2]'));

	test.ok(!ajlogo.evaluateText('equalp 1 2'));
	test.ok(!ajlogo.evaluateText('equalp "a "b'));
	test.ok(!ajlogo.evaluateText('equalp [1 2] [1]'));
	test.ok(!ajlogo.evaluateText('equalp [1 2] [2 3]'));
	test.ok(!ajlogo.evaluateText('equalp [1 2 3] [1 2 4]'));

	test.ok(!ajlogo.evaluateText('notequalp 1 1'));
	test.ok(!ajlogo.evaluateText('notequalp "a "a'));
	test.ok(!ajlogo.evaluateText('notequalp [1 2] [1 2]'));

	test.ok(ajlogo.evaluateText('notequalp 1 2'));
	test.ok(ajlogo.evaluateText('notequalp "a "b'));
	test.ok(ajlogo.evaluateText('notequalp [1 2] [1]'));

	test.done();
}

exports['emptyp'] = function(test) {
	var ctx = ajlogo.TopContext;

	test.ok(ajlogo.evaluateText('emptyp []'));
	test.ok(!ajlogo.evaluateText('emptyp 1'));
	test.ok(!ajlogo.evaluateText('emptyp [1 2]'));
	ctx.setVariable('empty', '');
	test.ok(ajlogo.evaluateText('emptyp :empty'));

	test.done();
}

exports['beforep'] = function(test) {
	test.ok(ajlogo.evaluateText('beforep 123 2'));
	test.ok(ajlogo.evaluateText('beforep "a "b'));
	test.ok(!ajlogo.evaluateText('beforep 2 123'));
	test.ok(!ajlogo.evaluateText('beforep "b "b'));

	test.done();
}

exports['memberp'] = function(test) {
	test.ok(ajlogo.evaluateText('memberp 1 [1 2 3]'));
	test.ok(ajlogo.evaluateText('memberp 2 [1 2 3]'));
	test.ok(ajlogo.evaluateText('memberp 3 [1 2 3]'));
	test.ok(ajlogo.evaluateText('memberp [2 3] [1 [2 3] 4]'));

	test.ok(!ajlogo.evaluateText('memberp 4 [1 2 3]'));
	test.ok(!ajlogo.evaluateText('memberp "a [1 2 3]'));
	test.ok(!ajlogo.evaluateText('memberp [2 3 4] [1 [2 3] 4]'));

	test.done();
}

exports['substringp'] = function(test) {
	test.ok(ajlogo.evaluateText('substringp "a "adam'));
	test.ok(ajlogo.evaluateText('substringp "oo "foo'));
	test.ok(!ajlogo.evaluateText('substringp "o "adam'));
	test.ok(!ajlogo.evaluateText('substringp "aa "foo'));

	test.done();
}
