var Runner = require("testlet");
var test = new Runner();
(function() {
  var TestSuite;

  TestSuite = require('../src/test');

  module.exports = function() {
    var testSuite, testSuite2;
    testSuite = new TestSuite('This is a test suite');
    testSuite.equal('test', 1, 1);
    testSuite.expect('test foo', (function() {
      return {
        foo: 'bar'
      };
    }), {
      foo: 'bar'
    });
    testSuite.expectAsync('test bar', (function(cb) {
      return cb(null, {
        bar: 'baz'
      });
    }), {
      bar: 'baz'
    });
    testSuite.expectError('test error', (function() {
      throw {
        error: true
      };
    }));
    testSuite2 = testSuite.makeSuite('a new test suite');
    testSuite2.equal('test again', 1, 1);
    testSuite2.notEqual('test 2 again', 1, 2);
    testSuite2.expect('test foo again', (function() {
      return {
        foo: 'bar'
      };
    }), {
      foo: 'bar'
    });
    testSuite2.expectAsync('test bar again', (function(cb) {
      return cb(null, {
        bar: 'baz'
      });
    }), {
      bar: 'baz'
    });
    testSuite2.expectError('test error again', (function() {
      throw {
        error: true
      };
    }));
    return testSuite.run(function() {
      return console.log('testResult', testSuite.toString());
    });
  };

}).call(this);

if (window) {
  window.test = test;
}
module.exports = test;
test.run(function (err, res) { console.log(err, res); });