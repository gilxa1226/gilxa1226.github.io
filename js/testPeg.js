var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); 	// for loading files

var wrapExceptions = function(f) {
	return function(x) {
		try {
			return f(x);
		} catch (e) {
			console.log(e);
			return undefined;
		}
	};
};
	

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parser = PEG.buildParser(data).parse;
var wrappedParser = wrapExceptions(parser);

// Do a test
assert.deepEqual(wrappedParser(""), undefined);
console.log("don't parse empty string");

assert.deepEqual(wrappedParser("atom"), "atom");
console.log("parse atom");

assert.deepEqual(wrappedParser("+"), "+");
console.log("parse +");

assert.deepEqual(wrappedParser("(+ x 3)"), ["+", "x", "3"]);
console.log("parse (+ x 3)");

assert.deepEqual(wrappedParser("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);
console.log("parse (+ 1 (f x 3 y))");

assert.deepEqual(wrappedParser("(+ 1 \t(f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);
console.log("parse with \\t");

assert.deepEqual(wrappedParser("(+ 1 \n\r(f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);
console.log("parse with \\n\\r");

assert.deepEqual(wrappedParser("(+ 1 \r(f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);
console.log("parse with \\r");

assert.deepEqual(wrappedParser("'x"), ["quote", "x"]);
console.log("parse 'x");

assert.deepEqual(wrappedParser("'(1 2 3)"), ["quote", [ "1", "2", "3"]]);
console.log("parse '(1 2 3)");

assert.deepEqual(wrappedParser("(x 1 2) ;; (x 5 6)\r\n"), ["x", "1", "2"]);
console.log("parse '(x 1 2) ;; (x 5 6)'");

console.log("All tests successful!!");


