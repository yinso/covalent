
define(['require','testlet'], function(require) {

// src/test
var ___SRC_TEST___ = (function(module) {
  (function() {
  var Expect, ExpectAsync, ExpectEqual, ExpectError, ExpectErrorAsync, TestRunner, TestSuite, deepEqual, forEach;

  deepEqual = function(o1, o2) {
    var both, left;
    left = function(o1, o2) {
      var key, val;
      for (key in o1) {
        val = o1[key];
        if (!o2.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };
    both = function(o1, o2) {
      var key, val;
      for (key in o1) {
        val = o1[key];
        if (!deepEqual(o1[key], o2[key])) {
          return false;
        }
      }
      return true;
    };
    if (o1 === o2) {
      return true;
    } else if (o1 instanceof Object && o2 instanceof Object) {
      return left(o1, o2) && left(o2, o1) && both(o1, o2);
    } else {
      return false;
    }
  };

  forEach = function(ary, iterator, callback) {
    var helper;
    helper = function(i, result) {
      var val;
      if (i === ary.length) {
        return callback(null);
      } else {
        val = ary[i];
        return iterator(val, function(err, result) {
          if (err) {
            return callback(err);
          } else {
            return helper(i + 1, result);
          }
        });
      }
    };
    return helper(0, null);
  };

  ExpectEqual = (function() {

    function ExpectEqual(name, lhs, rhs, negate) {
      this.name = name;
      this.lhs = lhs;
      this.rhs = rhs;
      this.negate = negate;
      this.pass = false;
      this.expected = true;
    }

    ExpectEqual.prototype.run = function(cb) {
      this.actual = deepEqual(this.lhs, this.rhs);
      this.pass = this.negate ? !this.actual : this.actual;
      return cb();
    };

    ExpectEqual.prototype.toString = function() {
      return "expect(" + this.name + ": " + this.lhs + " " + (this.negate ? '!=' : '==') + " " + this.rhs + "; actual: " + this.actual + ", pass: " + this.pass + ")";
    };

    return ExpectEqual;

  })();

  Expect = (function() {

    function Expect(name, code, expected) {
      this.name = name;
      this.code = code;
      this.expected = expected;
      this.pass = false;
    }

    Expect.prototype.run = function(cb) {
      try {
        this.actual = this.code();
        if (this.expected instanceof Function) {
          this.pass = this.expected(this.actual, this);
        } else {
          this.pass = deepEqual(this.expected, this.actual);
        }
      } catch (e) {
        this.actual = e;
      }
      return cb();
    };

    Expect.prototype.toString = function() {
      return "expect(" + this.name + ": " + this.code + "; expected: " + this.expected + ", actual: " + this.actual + ", pass: " + this.pass + ")";
    };

    return Expect;

  })();

  ExpectError = (function() {

    function ExpectError(name, code, expected) {
      this.name = name;
      this.code = code;
      this.expected = expected;
      this.pass = false;
    }

    ExpectError.prototype.run = function(cb) {
      try {
        this.actual = this.code();
        this.pass = false;
      } catch (e) {
        this.actual = e;
        this.pass = true;
      }
      return cb();
    };

    ExpectError.prototype.toString = function() {
      return "expectError(" + this.name + ": " + this.code + "; expected: " + this.expected + ", actual: " + this.actual + ", pass: " + this.pass + ")";
    };

    return ExpectError;

  })();

  ExpectAsync = (function() {

    function ExpectAsync(name, code, expected) {
      this.name = name;
      this.code = code;
      this.expected = expected;
      this.pass = false;
    }

    ExpectAsync.prototype.run = function(cb) {
      var _this = this;
      return this.code(function(err, actual) {
        _this.actual = actual;
        if (err) {
          _this.actual = err;
          _this.pass = false;
        } else if (_this.expected instanceof Function) {
          _this.pass = _this.expected(_this.actual);
        } else if (deepEqual(_this.expected, _this.actual)) {
          _this.pass = true;
        } else {
          _this.pass = false;
        }
        return cb();
      });
    };

    ExpectAsync.prototype.toString = function() {
      return "expectAsync(" + this.name + ": " + this.code + "; expected: " + this.expected + ", actual: " + this.actual + ", pass: " + this.pass + ")";
    };

    return ExpectAsync;

  })();

  ExpectErrorAsync = (function() {

    function ExpectErrorAsync(code, expected, msg) {
      this.code = code;
      this.expected = expected;
      this.msg = msg;
      this.pass = false;
    }

    ExpectErrorAsync.prototype.run = function(cb) {
      var _this = this;
      return this.code(function(err, actual) {
        if (err) {
          _this.actual = err;
          _this.pass = true;
        } else {
          _this.actual = actual;
          _this.pass = false;
        }
        return cb();
      });
    };

    ExpectErrorAsync.prototype.toString = function() {
      return "expectErrorAsync(" + this.name + ": " + this.code + "; expected: " + this.expected + ", actual: " + this.actual + ", pass: " + this.pass + ")";
    };

    return ExpectErrorAsync;

  })();

  TestSuite = (function() {

    function TestSuite(name) {
      this.name = name;
      this.cases = [];
      this.pass = false;
    }

    TestSuite.prototype.equal = function(name, lhs, rhs) {
      return this.cases.push(new ExpectEqual(name, lhs, rhs));
    };

    TestSuite.prototype.notEqual = function(name, lhs, rhs) {
      return this.cases.push(new ExpectEqual(name, lhs, rhs, true));
    };

    TestSuite.prototype.expect = function(name, code, expect) {
      return this.cases.push(new Expect(name, code, expect));
    };

    TestSuite.prototype.expectError = function(name, code, expect) {
      return this.cases.push(new ExpectError(name, code, expect));
    };

    TestSuite.prototype.expectAsync = function(name, code, expected) {
      return this.cases.push(new ExpectAsync(name, code, expected));
    };

    TestSuite.prototype.expectErrorAsync = function(name, code, expected) {
      return this.cases.push(new ExpectErrorAsync(name, code, expected));
    };

    TestSuite.prototype.makeSuite = function(name) {
      var suite;
      suite = new TestSuite(name);
      this.cases.push(suite);
      return suite;
    };

    TestSuite.prototype.run = function(cb) {
      var cases, helper,
        _this = this;
      cases = [].concat(this.cases);
      helper = function(testCase, next) {
        return testCase.run(next);
      };
      return forEach(cases, helper, function(err, res) {
        var testCase, _i, _len, _ref;
        _this.pass = true;
        _ref = _this.cases;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          testCase = _ref[_i];
          if (!testCase.pass) {
            _this.pass = false;
          }
        }
        return cb();
      });
    };

    TestSuite.prototype.toString = function() {
      var buffer, testCase, _i, _len, _ref;
      buffer = "testcase(" + this.name + " => pass: " + this.pass + "): \n";
      _ref = this.cases;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        testCase = _ref[_i];
        buffer += "  " + testCase.toString() + "\n";
      }
      return buffer;
    };

    return TestSuite;

  })();

  TestRunner = (function() {

    function TestRunner() {
      this.suites = [];
    }

    TestRunner.prototype.newSuite = function(name) {
      var suite;
      suite = new TestSuite(name);
      this.suites.push(suite);
      return suite;
    };

    TestRunner.prototype.run = function(cb) {
      var helper, suites,
        _this = this;
      suites = [].concat(this.suites);
      helper = function(suite, next) {
        return suite.run(next);
      };
      return forEach(suites, helper, function(err, res) {
        var suite, _i, _len, _ref;
        _this.pass = true;
        _ref = _this.suites;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          suite = _ref[_i];
          if (!suite.pass) {
            _this.pass = false;
          }
        }
        return cb();
      });
    };

    return TestRunner;

  })();

  module.exports = TestRunner;

}).call(this);

  return module.exports;
})({exports: {}});
// .target/covalent
var ___.TARGET_COVALENT___ = (function(module) {
  var Runner = require('testlet');
var test = new Runner();
(function() {
  var TestSuite;

  TestSuite = ___SRC_TEST___;

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
  return module.exports;
})({exports: {}});


  return ___.TARGET_COVALENT___;
});
