
define(['require'], function(require) {

// json2
var ___JSON2___ = (function(module) {
  









if (typeof JSON !== 'object') {
    JSON = {};
}

if (window && !window.JSON) {
  window.JSON = JSON;
}

(function () {
    'use strict';

    function f(n) {
        
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {






        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {



        var i,          
            k,          
            v,          
            length,
            mind = gap,
            partial,
            value = holder[key];



        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }




        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }



        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':



            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':





            return String(value);




        case 'object':




            if (!value) {
                return 'null';
            }



            gap += indent;
            partial = [];



            if (Object.prototype.toString.apply(value) === '[object Array]') {




                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }




                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }



            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {



                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }




            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }



    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {







            var i;
            gap = '';
            indent = '';




            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }



            } else if (typeof space === 'string') {
                indent = space;
            }




            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }




            return str('', {'': value});
        };
    }




    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {




            var j;

            function walk(holder, key) {




                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }






            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }














            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {






                j = eval('(' + text + ')');




                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }



            throw new SyntaxError('JSON.parse');
        };
    }
}());

  return module.exports;
})({exports: {}});
// fauxconsole
var ___FAUXCONSOLE___ = (function(module) {
  (function() {
  var FauxConsole,
    __slice = [].slice;

  FauxConsole = (function() {

    function FauxConsole() {
      this.inner = [];
    }

    FauxConsole.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.inner.push(args);
    };

    return FauxConsole;

  })();

  if (window && !window.console) {
    window.console = new FauxConsole();
  }

  module.exports = FauxConsole;

}).call(this);

  return module.exports;
})({exports: {}});
// util
var ___UTIL___ = (function(module) {
  






















var formatRegExp = /%[sdj%]/g;
module.exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};





module.exports.deprecate = function(fn, msg) {
  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


module.exports.print = function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(String(arguments[i]));
  }
};


module.exports.puts = function() {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(arguments[i] + '\n');
  }
};


module.exports.debug = function(x) {
  process.stderr.write('DEBUG: ' + x + '\n');
};


var error = module.exports.error = function(x) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    process.stderr.write(arguments[i] + '\n');
  }
};




function inspect(obj, opts) {
  
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (typeof opts === 'boolean') {
    
    ctx.showHidden = opts;
  } else if (opts) {
    
    module.exports._extend(ctx, opts);
  }
  
  if (typeof ctx.showHidden === 'undefined') ctx.showHidden = false;
  if (typeof ctx.depth === 'undefined') ctx.depth = 2;
  if (typeof ctx.colors === 'undefined') ctx.colors = false;
  if (typeof ctx.customInspect === 'undefined') ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
module.exports.inspect = inspect;



inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};


inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  
  
  if (ctx.customInspect && value && typeof value.inspect === 'function' &&
      
      value.inspect !== module.exports.inspect &&
      
      !(value.constructor && value.constructor.prototype === value)) {
    return String(value.inspect(recurseTimes));
  }

  
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  
  if (keys.length === 0) {
    if (typeof value === 'function') {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  
  if (typeof value === 'function') {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}




function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}
module.exports.isArray = isArray;


function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}
module.exports.isRegExp = isRegExp;


function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}
module.exports.isDate = isDate;


function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}
module.exports.isError = isError;


function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];


function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


module.exports.log = function(msg) {
  module.exports.puts(timestamp() + ' - ' + msg.toString());
};

if (typeof Object.create !== 'function') {
  Object.create = function(o, props) {
    function F() {}
    F.prototype = o;
    
    if (typeof(props) === "object") {
      for (prop in props) {
        if (props.hasOwnProperty((prop))) {
          F[prop] = props[prop];
        }
      }
    }
    return new F();
  };
}


module.exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

module.exports._extend = function(origin, add) {
  
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
  return module.exports;
})({exports: {}});
// assert
var ___ASSERT___ = (function(module) {
  


























var util = ___UTIL___;
var pSlice = Array.prototype.slice;





var assert = module.exports = ok;






assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};


util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};












function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}


assert.fail = fail;








function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;





assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};




assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};




assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  
  
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  
  
  
  } else if (actual instanceof RegExp && expected instanceof RegExp) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  
  
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  
  
  
  
  
  
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  
  if (a.prototype !== b.prototype) return false;
  
  
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = Object.keys(a),
        kb = Object.keys(b),
        key, i;
  } catch (e) {
    return false;
  }
  
  
  if (ka.length != kb.length)
    return false;
  
  ka.sort();
  kb.sort();
  
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  
  
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}




assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};




assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};




assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}




assert.throws = function(block, error, message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};


assert.doesNotThrow = function(block, message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

  return module.exports;
})({exports: {}});
// events
var ___EVENTS___ = (function(module) {
  






















var isArray = Array.isArray ? Array.isArray : function(ary) { return ary instanceof Array; };

function EventEmitter() {
  this._events = this._events || null;
  this._maxListeners = this._maxListeners || defaultMaxListeners;
}
module.exports.EventEmitter = EventEmitter;







var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  this._maxListeners = n;
};


var PROCESS;

EventEmitter.prototype.emit = function(type) {
  
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {

      if (arguments[1] instanceof Error) {
        throw arguments[1]; 
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      
      default:
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var l = arguments.length;
    var args = new Array(l - 1);
    for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

EventEmitter.prototype.trigger = EventEmitter.prototype.emit;


EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  
  
  if (this._events.newListener) {
    this.emit('newListener', type, typeof listener.listener === 'function' ?
              listener.listener : listener);
  }

  if (!this._events[type]) {
    
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    
    this._events[type].push(listener);

  } else {
    
    this._events[type] = [this._events[type], listener];

  }

  
  if (isArray(this._events[type]) && !this._events[type].warned) {
    var m;
    m = this._maxListeners;

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('.once only takes instances of Function');
  }

  var self = this;
  function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  };

  g.listener = listener;
  self.on(type, g);

  return this;
};


EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var position = -1;
    for (var i = 0, length = list.length; i < length; i++) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener))
      {
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    list.splice(position, 1);
    if (list.length == 0)
      this._events[type] = null;

    if (this._events.removeListener) {
      this.emit('removeListener', type, listener);
    }
  } else if (list === listener ||
             (list.listener && list.listener === listener))
  {
    this._events[type] = null;

    if (this._events.removeListener) {
      this.emit('removeListener', type, listener);
    }
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;


EventEmitter.prototype.removeAllListeners = function(type) {
  if (!this._events) return this;

  
  if (!this._events.removeListener) {
    if (arguments.length === 0) {
      this._events = {};
    } else if (type && this._events && this._events[type]) {
      this._events[type] = null;
    }
    return this;
  }

  
  if (arguments.length === 0) {
    for (var key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  var listeners = this._events[type];
  if (isArray(listeners)) {
    while (listeners.length) {
      
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  } else if (listeners) {
    this.removeListener(type, listeners);
  }
  this._events[type] = null;

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events || !this._events[type]) return [];
  if (!isArray(this._events[type])) {
    return [this._events[type]];
  }
  return this._events[type].slice(0);
};
  return module.exports;
})({exports: {}});
// querystring
var ___QUERYSTRING___ = (function(module) {
  



(function() {
  var combineKVS, parse, stringify;

  combineKVS = function(kvs) {
    var kv, out, _i, _len;
    out = {};
    for (_i = 0, _len = kvs.length; _i < _len; _i++) {
      kv = kvs[_i];
      if (!kv) {
        continue;
      }
      if (out[kv[0]]) {
        if (out[kv[0]] instanceof Array) {
          out[kv[0]].push(kv[1]);
        } else {
          out[kv[0]] = [out[kv[0]], kv[1]];
        }
      } else {
        out[kv[0]] = kv[1];
      }
    }
    return out;
  };

  parse = function(qs, sep, eq) {
    var parseKV, parseQuery;
    if (sep == null) {
      sep = '&';
    }
    if (eq == null) {
      eq = '=';
    }
    parseKV = function(kv) {
      var str, _i, _len, _ref, _results;
      if (kv) {
        _ref = kv.split(eq);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          str = _ref[_i];
          _results.push(module.exports.unescape(str));
        }
        return _results;
      } else {
        return null;
      }
    };
    parseQuery = function(qs) {
      var kv;
      return combineKVS((function() {
        var _i, _len, _ref, _results;
        _ref = qs.split(sep);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          kv = _ref[_i];
          _results.push(parseKV(kv));
        }
        return _results;
      })());
    };
    if (qs === '' || qs === '?') {
      return {};
    } else {
      return parseQuery(qs[0] === '?' ? qs.substring(1) : qs);
    }
  };

  stringify = function(obj, sep, eq) {
    var encode, key, kvs, v, val;
    if (sep == null) {
      sep = '&';
    }
    if (eq == null) {
      eq = '=';
    }
    encode = function(key, val) {
      var str;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = [key, val];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          str = _ref[_i];
          _results.push(module.exports.escape(str));
        }
        return _results;
      })()).join(eq);
    };
    kvs = [];
    for (key in obj) {
      val = obj[key];
      if (val instanceof Array) {
        kvs = kvs.concat((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = val.length; _i < _len; _i++) {
            v = val[_i];
            _results.push(encode(key, v));
          }
          return _results;
        })());
      } else {
        kvs.push(encode(key, val));
      }
    }
    return kvs.join(sep);
  };

  module.exports = {
    parse: parse,
    escape: encodeURIComponent,
    unescape: decodeURIComponent,
    stringify: stringify
  };

}).call(this);

  return module.exports;
})({exports: {}});
// url
var ___URL___ = (function(module) {
  (function() {
  var qs, urlFormat, urlParse;

  qs = ___QUERYSTRING___;

  urlParse = function(url, parseQueryString, slashesDenoteHost) {
    var parsed;
    if (parseQueryString == null) {
      parseQueryString = true;
    }
    if (slashesDenoteHost == null) {
      slashesDenoteHost = false;
    }
    parsed = document.createElement('a');
    if (slashesDenoteHost && url.match(/^\/\//)) {
      url = "http:" + url;
    }
    parsed.href = url;
    if (parseQueryString) {
      parsed.query = qs.parse(parsed.search);
    }
    return parsed;
  };

  urlFormat = function(_arg) {
    var a, auth, hash, host, hostname, pathname, port, protocol, query, search;
    protocol = _arg.protocol, auth = _arg.auth, hostname = _arg.hostname, port = _arg.port, host = _arg.host, pathname = _arg.pathname, search = _arg.search, query = _arg.query, hash = _arg.hash;
    a = document.createElement('a');
    if (protocol) {
      a.protocol = protocol;
    }
    if (auth) {
      a.auth = auth;
    }
    if (!host && hostname) {
      a.hostname = hostname;
    }
    if (!host && port) {
      a.port = port;
    }
    if (host) {
      a.host = host;
    }
    if (pathname) {
      a.pathname = pathname;
    }
    if (query && !search) {
      a.query = query;
    }
    if (search) {
      a.search = search;
    }
    if (hash) {
      a.hash = hash;
    }
    return a.href;
  };

  module.exports = {
    parse: urlParse,
    format: urlFormat
  };

}).call(this);

  return module.exports;
})({exports: {}});
// path
var ___PATH___ = (function(module) {
  



























function normalizeArray(parts, allowAboveRoot) {
  
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}



var splitPathRe =
  /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};



module.exports.resolve = function() {
  var resolvedPath = '',
  resolvedAbsolute = false;
  
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';
    
    
    if (typeof path !== 'string' || !path) {
      continue;
    }
    
    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }
  
  
  
  
  
  resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');
  
  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};



module.exports.normalize = function(path) {
  var isAbsolute = path.charAt(0) === '/',
  trailingSlash = path.substr(-1) === '/';
  
  
  path = normalizeArray(path.split('/').filter(function(p) {
    return !!p;
  }), !isAbsolute).join('/');
  
  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};



module.exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return module.exports.normalize(paths.filter(function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};




module.exports.relative = function(from, to) {
  from = module.exports.resolve(from).substr(1);
  to = module.exports.resolve(to).substr(1);
  
  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }
    
    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }
    
    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }
  
  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));
  
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }
  
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }
  
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  
  return outputParts.join('/');
};

module.exports.sep = '/';
module.exports.delimiter = ':';

module.exports.dirname = function(path) {
  var result = splitPath(path),
  root = result[0],
  dir = result[1];
  
  if (!root && !dir) {
    
    return '.';
  }
  
  if (dir) {
    
    dir = dir.substr(0, dir.length - 1);
  }
  
  return root + dir;
};


module.exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


module.exports.extname = function(path) {
  return splitPath(path)[3];
};


module.exports._makeLong = function(path) {
  return path;
};


  return module.exports;
})({exports: {}});
// crypto
var ___CRYPTO___ = (function(module) {
  (function() {
  var ifAsync, mathRandomBytes, randomBytes, windowCryptoRandomBytes;

  randomBytes = function(size, cb) {
    var res, _ref;
    res = (typeof window !== "undefined" && window !== null ? (_ref = window.crypto) != null ? _ref.getRandomBytes : void 0 : void 0) ? windowCryptoRandomBytes(size) : mathRandomBytes(size);
    return ifAsync(res, cb);
  };

  ifAsync = function(res, cb) {
    if (cb) {
      return cb(res);
    } else {
      return res;
    }
  };

  mathRandomBytes = function(size) {
    var ary, i, r, _i;
    ary = new Array(size);
    for (i = _i = 0; _i < size; i = _i += 1) {
      if ((i & 0x03) === 0) {
        r = Math.random() * 0x100000000;
      }
      ary[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }
    return ary;
  };

  windowCryptoRandomBytes = function(size) {
    var ary;
    ary = new UInt8Array(size);
    window.crypto.getRandomBytes(ary);
    return ary;
  };

  module.exports = {
    randomBytes: randomBytes,
    mathRandomBytes: mathRandomBytes
  };

}).call(this);

  return module.exports;
})({exports: {}});
// main
var ___MAIN___ = (function(module) {
  (function() {
  var assert, crypto, events, path, querystring, url, util;

  ___JSON2___;

  ___FAUXCONSOLE___;

  util = ___UTIL___;

  assert = ___ASSERT___;

  events = ___EVENTS___;

  url = ___URL___;

  querystring = ___QUERYSTRING___;

  path = ___PATH___;

  crypto = ___CRYPTO___;

  module.exports = {
    util: util,
    assert: assert,
    events: events,
    url: url,
    querystring: querystring,
    path: path,
    crypto: crypto
  };

}).call(this);

  return module.exports;
})({exports: {}});


  return ___MAIN___;
});
