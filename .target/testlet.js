
define(['require','builtin'], function(require) {

// src/util
var ___SRC_UTIL___ = (function(module) {
  (function() {
  var callerFilePath, deepEqual, forEach, path, requireContext, stack, testGetStack;

  path = require('builtin').path;

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

  stack = function() {
    var err, origPrepStack;
    origPrepStack = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack;
    };
    err = new Error();
    stack = err.stack;
    Error.prepareStackTrace = origPrepStack;
    return stack;
  };

  callerFilePath = function(beyondFunc) {
    var stacks, top;
    stacks = stack();
    top = stacks[0];
    while (stacks.length > 0) {
      if (stacks[0].getFunctionName() === beyondFunc) {
        stacks.shift();
        return stacks[0].getFileName();
      } else {
        stacks.shift();
      }
    }
    throw new Error("stack_not_matching_funcName: " + beyondFunc);
  };

  requireContext = function(spec, context) {
    var callerPath, key, replaced, val;
    callerPath = callerFilePath('requireContext');
    replaced = {};
    for (key in context) {
      val = context[key];
      if (context.hasOwnProperty(key)) {
        if (global.hasOwnProperty(key)) {
          replaced[key] = global[key];
        }
        global[key] = val;
      }
    }
    try {
      return require(path.resolve(callerPath, '..', spec));
    } finally {
      for (key in context) {
        val = context[key];
        if (context.hasOwnProperty(key)) {
          if (replaced.hasOwnProperty(key)) {
            global[key] = replaced[key];
          } else {
            delete global[key];
          }
        }
      }
    }
  };

  testGetStack = function() {
    return getStack();
  };

  module.exports = {
    deepEqual: deepEqual,
    forEach: forEach,
    require: requireContext,
    stack: stack,
    callerFilePath: callerFilePath
  };

}).call(this);

  return module.exports;
})({exports: {}});
// src/runner
var ___SRC_RUNNER___ = (function(module) {
  (function() {
  var Runner, Suite, SuiteResult, Test, TestResult, deepEqual, forEach, _ref;

  _ref = ___SRC_UTIL___, deepEqual = _ref.deepEqual, forEach = _ref.forEach;

  TestResult = (function() {

    function TestResult(_case, error) {
      this["case"] = _case;
      this.error = error;
      this.pass = !this.error;
    }

    return TestResult;

  })();

  Test = (function() {

    function Test(name, func) {
      this.name = name;
      this.func = func;
      this.async = this.func && this.func.length;
    }

    Test.prototype.run = function(next) {
      var result,
        _this = this;
      if (this.async) {
        try {
          return this.func(function(err, res) {
            var result;
            console.log('Test.run', _this.async, _this.func);
            result = err ? new TestResult(_this, e) : new TestResult(_this);
            return next(null, result);
          });
        } catch (e) {
          return next(null, new TestResult(this, e));
        }
      } else {
        result = (function() {
          try {
            this.func();
            return new Result(this);
          } catch (e) {
            return new Result(this, e);
          }
        }).call(this);
        return next(null, result);
      }
    };

    return Test;

  })();

  SuiteResult = (function() {

    function SuiteResult(suite) {
      this.suite = suite;
      this.results = [];
      this.pass = true;
    }

    SuiteResult.prototype.push = function(result) {
      this.results.push(result);
      if (!result.pass) {
        return this.pass = false;
      }
    };

    return SuiteResult;

  })();

  Suite = (function() {

    function Suite(name, func) {
      this.name = name;
      this.func = func;
      if (!this.func instanceof Function) {
        throw new Error("Suite_expect_name_and_function; passed: " + this.name + ", " + this.func);
      }
      this.cases = [];
    }

    Suite.prototype["eval"] = function() {
      return this.func();
    };

    Suite.prototype.add = function(testCase) {
      return this.cases.push(testCase);
    };

    Suite.prototype.run = function(next) {
      var cases, helper, result;
      result = new SuiteResult(this);
      helper = function(test, next) {
        return test.run(function(err, res) {
          result.push(res);
          return next();
        });
      };
      cases = [].concat(this.cases);
      return forEach(cases, helper, function(err, res) {
        if (err) {
          return next(err);
        } else {
          return next(null, result);
        }
      });
    };

    return Suite;

  })();

  Runner = (function() {

    function Runner() {
      this.suites = [];
    }

    Runner.prototype.add = function(name, func) {
      var prevSuite, suite;
      suite = new Suite(name, func);
      this.suites.push(suite);
      prevSuite = this.currentSuite;
      this.currentSuite = suite;
      try {
        return this.currentSuite["eval"]();
      } finally {
        this.currentSuite = prevSuite;
      }
    };

    Runner.prototype["do"] = function(name, func) {
      return this.currentSuite.add(new Test(name, func));
    };

    Runner.prototype.ok = function(val, msg) {
      if (msg == null) {
        msg = "ok(" + val + ")";
      }
      if (!val) {
        throw new Error("failed: " + msg);
      }
    };

    Runner.prototype.equal = function(lhs, rhs, msg) {
      if (msg == null) {
        msg = "" + lhs + " == " + rhs;
      }
      if (!deepEqual(lhs, rhs)) {
        throw new Error("failed: " + msg);
      }
    };

    Runner.prototype.throws = function(lhs, msg) {
      if (msg == null) {
        msg = "" + lhs + " expect to throw";
      }
      try {
        lhs();
        throw new Error("failed: " + msg);
      } catch (e) {

      }
    };

    Runner.prototype.isa = function(lhs, rhs, msg) {
      if (msg == null) {
        msg = "" + lhs + " typeof " + rhs;
      }
      if (typeof rhs === 'string') {
        if (!typeof lhs === rhs) {
          throw new Error("failed: " + msg);
        }
      } else {
        if (!lhs instanceof rhs) {
          throw new Error("failed: " + msg);
        }
      }
    };

    Runner.prototype.run = function(cb) {
      var cases, helper, result;
      console.log('Runner.run');
      result = new SuiteResult(this);
      cases = [].concat(this.suites);
      helper = function(test, next) {
        return test.run(function(err, res) {
          if (err) {
            return next(err);
          } else {
            result.push(res);
            return next(null, result);
          }
        });
      };
      return forEach(cases, helper, function(err, res) {
        return cb(err, result);
      });
    };

    return Runner;

  })();

  module.exports = Runner;

}).call(this);

  return module.exports;
})({exports: {}});


  return ___SRC_RUNNER___;
});
