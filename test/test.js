
var assert = require('assert');
global.testing = true;
var ajlogo = require('../lib/ajlogo.js');

// Context

var ctx = ajlogo.TopContext;

assert.ok(ctx);

assert.equal(null, ctx.getVariable('foo'));

ctx.setVariable('foo', 'bar');
assert.equal('bar', ctx.getVariable('foo'));

// Nested Context

var newctx = new ajlogo.Context(ctx);

assert.ok(ctx.getProcedure('make'));
assert.ok(newctx.getProcedure('make'));

ctx.setVariable('a', 1);
newctx.setVariable('a', 2);

assert.equal(2, ctx.getVariable('a'));
assert.equal(2, newctx.getVariable('a'));

ctx.setVariable('b', 1);
newctx.defineVariable('b');
newctx.setVariable('b', 2);

assert.equal(1, ctx.getVariable('b'));
assert.equal(2, newctx.getVariable('b'));

newctx.setVariable('c', 3);

assert.equal(3, ctx.getVariable('c'));
assert.equal(3, newctx.getVariable('c'));

// Evaluate Composite Expression

var expression = new ajlogo.CompositeExpression([1, 2, 3]);
assert.equal(3, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, 3]);
assert.equal(5, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, 3, new ajlogo.ProcedureReference('sum'), 4, 5]);
assert.equal(9, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), 2, new ajlogo.ProcedureReference('sum'), 4, 5]);
assert.equal(11, expression.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), "foo", "bar"]);
assert.equal("foobar", expression.evaluate(ctx));

ctx.setVariable('one', 1);
ctx.setVariable('two', 2);

var one = new ajlogo.VariableReference('one');
var two = new ajlogo.VariableReference('two');

assert.equal(1, one.evaluate(ctx));
assert.equal(2, two.evaluate(ctx));

expression = new ajlogo.CompositeExpression([new ajlogo.ProcedureReference('sum'), one, two]);
assert.equal(3, expression.evaluate(ctx));

// Compile List

list = ajlogo.compileList([1, 2, 3]);
assert.ok(list);
assert.equal(3, list.length);
assert.equal(1, list[0]);
assert.equal(2, list[1]);
assert.equal(3, list[2]);

list = ajlogo.compileList([false, true]);
assert.ok(list);
assert.equal(2, list.length);
assert.equal(false, list[0]);
assert.equal(true, list[1]);

list = ajlogo.compileList(['sum', 1, 2]);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));

list = ajlogo.compileList(['sum', '"foo', '"bar']);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal("foobar", (new ajlogo.CompositeExpression(list)).evaluate(ctx));

list = ajlogo.compileList(['sum', ':one', ':two']);
assert.ok(list[0] instanceof ajlogo.ProcedureReference);
assert.equal(3, (new ajlogo.CompositeExpression(list)).evaluate(ctx));

// Evaluate List

assert.equal(3, ajlogo.evaluateList([1,2,3], ctx));
assert.equal('foobar', ajlogo.evaluateList(['sum','"foo','"bar'], ctx));
assert.equal(3, ajlogo.evaluateList(['sum',':one',':two'], ctx));

// Compile text

assert.equal(1, ajlogo.compileText('1')[0]);
assert.equal(-1, ajlogo.compileText('-1')[0]);

result = ajlogo.compileText("sum");
assert.ok(result);
assert.equal(1, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);

result = ajlogo.compileText("sum 1 2");
assert.ok(result);
assert.equal(3, result.length);
assert.ok(result[0] instanceof ajlogo.ProcedureReference);
assert.equal(1, result[1]);
assert.equal(2, result[2]);

result = ajlogo.compileText("sum :one :two");
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

result = ajlogo.compileText('print [1 2 3]');
assert.equal(2, result.length);
assert.ok(result[1] instanceof Array);
assert.equal(3, result[1].length);

// True and false

result = ajlogo.compileText('true false');
assert.equal(2, result.length);
assert.ok(true === result[0]);
assert.ok(false === result[1]);

// Primitives

assert.ok(ctx.getProcedure('sum'));
assert.ok(ctx.getProcedure('make'));
assert.ok(ctx.getProcedure('word'));
assert.ok(ctx.getProcedure('output'));
assert.ok(ctx.getProcedure('stop'));
assert.ok(ctx.getProcedure('print'));
assert.ok(ctx.getProcedure('type'));
assert.ok(ctx.getProcedure('if'));
assert.ok(ctx.getProcedure('ifalse'));
assert.ok(ctx.getProcedure('ifelse'));
assert.ok(ctx.getProcedure('test'));
assert.ok(ctx.getProcedure('iftrue'));
assert.ok(ctx.getProcedure('iffalse'));
assert.ok(ctx.getProcedure('run'));
assert.ok(ctx.getProcedure('runresult'));
assert.ok(ctx.getProcedure('local'));
assert.ok(ctx.getProcedure('localmake'));
assert.ok(ctx.getProcedure('sum'));
assert.ok(ctx.getProcedure('difference'));
assert.ok(ctx.getProcedure('product'));
assert.ok(ctx.getProcedure('quotient'));
assert.ok(ctx.getProcedure('power'));
assert.ok(ctx.getProcedure('remainder'));
assert.ok(ctx.getProcedure('modulo'));
assert.ok(ctx.getProcedure('minus'));
assert.ok(ctx.getProcedure('abs'));
assert.ok(ctx.getProcedure('int'));
assert.ok(ctx.getProcedure('round'));
assert.ok(ctx.getProcedure('floor'));
assert.ok(ctx.getProcedure('ceil'));
assert.ok(ctx.getProcedure('sqrt'));
assert.ok(ctx.getProcedure('exp'));
assert.ok(ctx.getProcedure('log10'));
assert.ok(ctx.getProcedure('ln'));
assert.ok(ctx.getProcedure('sin'));
assert.ok(ctx.getProcedure('cos'));
assert.ok(ctx.getProcedure('tan'));
assert.ok(ctx.getProcedure('radsin'));
assert.ok(ctx.getProcedure('radcos'));
assert.ok(ctx.getProcedure('radtan'));
assert.ok(ctx.getProcedure('arctan'));
assert.ok(ctx.getProcedure('arcsin'));
assert.ok(ctx.getProcedure('arccos'));
assert.ok(ctx.getProcedure('radarctan'));
assert.ok(ctx.getProcedure('radarcsin'));
assert.ok(ctx.getProcedure('radarccos'));
assert.ok(ctx.getProcedure('iseq'));
assert.ok(ctx.getProcedure('rseq'));
assert.ok(ctx.getProcedure('repeat'));
assert.ok(ctx.getProcedure('forever'));
assert.ok(ctx.getProcedure('ignore'));
assert.ok(ctx.getProcedure('for'));
assert.ok(ctx.getProcedure('repcount'));

result = ajlogo.compileText('make "three 3');
(new ajlogo.CompositeExpression(result)).evaluate(ctx);
assert.equal(3, ctx.getVariable('three'));

result = ajlogo.compileText('sum 1 2');
assert.equal(1, result[1]);
assert.equal(2, result[2]);
assert.equal(3, ajlogo.evaluateText('sum 1 2', ctx));
assert.equal(3, ajlogo.evaluateText('sum 1 2'));

assert.equal(null, ajlogo.evaluateText('make "four 3', ctx));

// To

assert.ok(ctx.getProcedure('to'));

ajlogo.evaluateText('to setfoo make "foo "newbar end');
result = ctx.getProcedure('setfoo');
assert.ok(result);
assert.ok(result.body);
assert.ok(result.body instanceof Array);
assert.equal(3, result.body.length);

ajlogo.evaluateText('setfoo');

assert.equal("newbar", ctx.getVariable('foo'));

ajlogo.evaluateText('to sumxy :x :y output sum :x :y end');
result = ctx.getProcedure('sumxy');
assert.equal(2, result.argnames.length);
assert.equal('x', result.argnames[0]);
assert.equal('y', result.argnames[1]);

assert.equal(3, ajlogo.evaluateText('sumxy 1 2'));

// Print and Type

var output = '';

ajlogo.registerOutput(function(value) { output += value; });
ajlogo.evaluateText('type 1 type 2');
assert.equal('12', output);

output = '';
ajlogo.evaluateText('print 1 print 2');
assert.equal('1\r\n2\r\n', output);

output = '';
ajlogo.evaluateText('type [1 2 3]');
assert.equal('1 2 3', output);

output = '';
ajlogo.evaluateText('print [1 2 3]');
assert.equal('1 2 3\r\n', output);

// If and variants

ctx.setVariable('ifone', 0);
ajlogo.evaluateText('if 1 [make "ifone 1]');
assert.equal(1, ctx.getVariable('ifone'));
ajlogo.evaluateText('if 0 [make "ifone 2]');
assert.equal(1, ctx.getVariable('ifone'));

ajlogo.evaluateText('ifalse 0 [make "iftwo 2]');
assert.equal(2, ctx.getVariable('iftwo'));
ajlogo.evaluateText('ifalse false [make "ifthree 3]');
assert.equal(3, ctx.getVariable('ifthree'));

ajlogo.evaluateText('ifalse 1 [make "iftwo 3]');
assert.equal(2, ctx.getVariable('iftwo'));
ajlogo.evaluateText('ifalse true [make "iftwo 4]');
assert.equal(2, ctx.getVariable('iftwo'));

assert.equal(1, ajlogo.evaluateText('if true [1]'));
assert.equal(null, ajlogo.evaluateText('if false [1]'));
assert.equal(1, ajlogo.evaluateText('ifelse true [1] [2]'));
assert.equal(2, ajlogo.evaluateText('ifelse false [1] [2]'));

assert.equal(true, ajlogo.evaluateText('ifelse true [true] [false]'));

ajlogo.evaluateText('test true iftrue [make "testresult true] iffalse [make "testresult false]');
assert.equal(true, ctx.getVariable('testresult'));

ajlogo.evaluateText('test false iftrue [make "testresult true] iffalse [make "testresult false]');
assert.equal(false, ctx.getVariable('testresult'));

// stop

ajlogo.evaluateText('if true [make "testvar 1 stop make "testvar 2]');
assert.equal(1, ctx.getVariable('testvar'));

// run

ajlogo.evaluateText('run [make "testrun 1 stop make "testrun 2]');
assert.equal(1, ctx.getVariable('testrun'));

output = '';
ajlogo.evaluateText('run [print [hello world]]');
assert.equal('hello world\r\n', output);

// runresult

result = ajlogo.evaluateText('runresult [make "testrun 1 stop make "testrun 2]');
assert.ok(result instanceof Array);
assert.equal(0, result.length);

result = ajlogo.evaluateText('runresult [make "testrun 1 stop make "testrun 2]');
assert.ok(result instanceof Array);
assert.equal(0, result.length);

result = ajlogo.evaluateText('runresult [make "testrun 1 output 2 make "testrun 2]');
assert.ok(result instanceof Array);
assert.equal(1, result.length);
assert.equal(2, result[0]);

// local, make, localmake

ajlogo.evaluateText('make "a 1 run [local "a make "a 2 make "b :a]');
assert.equal(1, ctx.getVariable('a'));
assert.equal(2, ctx.getVariable('b'));

ajlogo.evaluateText('make "a 3 run [localmake "a 4 make "b :a]');
assert.equal(3, ctx.getVariable('a'));
assert.equal(4, ctx.getVariable('b'));

// arithmetic

assert.equal(3, ajlogo.evaluateText('sum 1 2'));
assert.equal(-1, ajlogo.evaluateText('difference 1 2'));
assert.equal(6, ajlogo.evaluateText('product 2 3'));
assert.equal(2, ajlogo.evaluateText('quotient 6 3'));

assert.equal(9, ajlogo.evaluateText('power 3 2'));
assert.equal(8, ajlogo.evaluateText('power 2 3'));

assert.equal(2, ajlogo.evaluateText('remainder 7 5'));
assert.equal(2, ajlogo.evaluateText('remainder 7 -5'));
assert.equal(-2, ajlogo.evaluateText('remainder -7 5'));
assert.equal(-2, ajlogo.evaluateText('remainder -7 -5'));

assert.equal(2, ajlogo.evaluateText('modulo 7 5'));
assert.equal(-2, ajlogo.evaluateText('modulo 7 -5'));
assert.equal(2, ajlogo.evaluateText('modulo -7 5'));
assert.equal(-2, ajlogo.evaluateText('modulo -7 -5'));

assert.equal(-3, ajlogo.evaluateText('minus 3'));
assert.equal(3, ajlogo.evaluateText('minus -3'));

assert.equal(3, ajlogo.evaluateText('abs 3'));
assert.equal(3, ajlogo.evaluateText('abs -3'));

assert.equal(3, ajlogo.evaluateText('round 3.4'));
assert.equal(4, ajlogo.evaluateText('round 3.6'));
assert.equal(4, ajlogo.evaluateText('round 3.5'));
assert.equal(-3, ajlogo.evaluateText('round -3.4'));
assert.equal(-4, ajlogo.evaluateText('round -3.6'));
assert.equal(-3, ajlogo.evaluateText('round -3.5'));

assert.equal(3, ajlogo.evaluateText('int 3.4'));
assert.equal(3, ajlogo.evaluateText('int 3.6'));
assert.equal(3, ajlogo.evaluateText('int 3.5'));
assert.equal(-3, ajlogo.evaluateText('int -3.4'));
assert.equal(-3, ajlogo.evaluateText('int -3.6'));
assert.equal(-3, ajlogo.evaluateText('int -3.5'));

assert.equal(3, ajlogo.evaluateText('floor 3.4'));
assert.equal(3, ajlogo.evaluateText('floor 3.6'));
assert.equal(3, ajlogo.evaluateText('floor 3.5'));
assert.equal(-4, ajlogo.evaluateText('floor -3.4'));
assert.equal(-4, ajlogo.evaluateText('floor -3.6'));
assert.equal(-4, ajlogo.evaluateText('floor -3.5'));

assert.equal(4, ajlogo.evaluateText('ceil 3.4'));
assert.equal(4, ajlogo.evaluateText('ceil 3.6'));
assert.equal(4, ajlogo.evaluateText('ceil 3.5'));
assert.equal(-3, ajlogo.evaluateText('ceil -3.4'));
assert.equal(-3, ajlogo.evaluateText('ceil -3.6'));
assert.equal(-3, ajlogo.evaluateText('ceil -3.5'));

assert.equal(2, ajlogo.evaluateText('sqrt 4'));
assert.equal(Math.sqrt(5), ajlogo.evaluateText('sqrt 5'));
assert.equal(1, ajlogo.evaluateText('log10 10'));
assert.equal(2, ajlogo.evaluateText('log10 100'));
assert.equal(Math.E, ajlogo.evaluateText('exp 1'));
assert.equal(Math.log(10), ajlogo.evaluateText('ln 10'));

assert.equal(0, ajlogo.evaluateText('sin 0'));
assert.equal(0, ajlogo.evaluateText('radsin 0'));

assert.equal(1, ajlogo.evaluateText('sin 90'));
assert.equal(1, ajlogo.evaluateText('radsin ' + (Math.PI/2)));

assert.equal(1, ajlogo.evaluateText('cos 0'));
assert.equal(1, ajlogo.evaluateText('radcos 0'));

result = ajlogo.evaluateText('cos 90');
assert.ok( 0 <= result && result <= 1e-10);
result = ajlogo.evaluateText('radcos ' + (Math.PI/2));
assert.ok( 0 <= result && result <= 1e-10);

result = ajlogo.evaluateText('tan 45');
assert.ok( 0.99999999 <= result && result <= 1.000001);
assert.equal(0, ajlogo.evaluateText('tan 0'));
result = ajlogo.evaluateText('radtan '+ (Math.PI/4));
assert.ok( 0.99999999 <= result && result <= 1.000001);
assert.equal(0, ajlogo.evaluateText('radtan 0'));

result = ajlogo.evaluateText('radarctan 1') - Math.PI/4;
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('arctan 1') - 45;
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('radarccos 1');
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('arccos 1');
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('radarcsin 0');
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('arcsin 0');
assert.ok( -0.00000001 <= result && result <= 0.00000001);

result = ajlogo.evaluateText('iseq 1 3');
assert.ok(result instanceof Array);
assert.equal(3, result.length);
assert.equal(1, result[0]);
assert.equal(2, result[1]);
assert.equal(3, result[2]);

result = ajlogo.evaluateText('iseq 1 -2');
assert.ok(result instanceof Array);
assert.equal(4, result.length);
assert.equal(1, result[0]);
assert.equal(0, result[1]);
assert.equal(-1, result[2]);
assert.equal(-2, result[3]);

result = ajlogo.evaluateText('rseq 1 2 2');
assert.ok(result instanceof Array);
assert.equal(3, result.length);
assert.equal(1, result[0]);
assert.equal(1.5, result[1]);
assert.equal(2, result[2]);

result = ajlogo.evaluateText('rseq 1 -1 2');
assert.ok(result instanceof Array);
assert.equal(3, result.length);
assert.equal(1, result[0]);
assert.equal(0, result[1]);
assert.equal(-1, result[2]);

// repeat, forever, repcount

output = '';
ajlogo.evaluateText('repeat 4 [type 1]');
assert.equal('1111', output);

output = '';
ajlogo.evaluateText('repeat 4 [type repcount]');
assert.equal('1234', output);

output = '';
ajlogo.evaluateText('forever [type 1 stop]');
assert.equal('1', output);

output = '';
ajlogo.evaluateText('forever [type repcount stop]');
assert.equal('1', output);

output = '';
ajlogo.evaluateText('make "a 10 forever [make "a difference :a 1 test :a iffalse [stop]]');
assert.equal(0, ctx.getVariable('a'));

// ignore

assert.equal(null, ajlogo.evaluateText('ignore 2'));

// for

output = '';
ajlogo.evaluateText('for [k 1 10] [type :k]');
assert.equal('12345678910', output);

output = '';
ajlogo.evaluateText('for [k 1 10 2] [type :k]');
assert.equal('13579', output);

