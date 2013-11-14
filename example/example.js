require.config({
  "paths": {
    "jquery": "../lib/jquery",
    "covalent": "../lib/covalent",
    "builtin": "../lib/builtin"
  },
  "shim": {
    "jquery": {
      "deps": [],
      "exports": "jQuery"
    }
  }
});
define(['require','builtin','jquery','covalent'], function(require) {

// main
var ___MAIN___ = (function(module) {
  (function() {
  var $, Account, AppNetLoader, ContextStack, EventEmitter, Request, Runtime, mockLoggedIn, runtime, test, testData, throttleAsync,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EventEmitter = require('builtin').events.EventEmitter;

  $ = require('jquery');

  Runtime = require('covalent');

  ContextStack = (function() {

    function ContextStack(context) {
      this.stack = [context];
    }

    ContextStack.prototype.top = function() {
      if (this.stack.length === 0) {
        throw new Error("ContextStack:stack_empty");
      }
      return this.stack[this.stack.length - 1];
    };

    ContextStack.prototype.push = function(path) {
      var proxy;
      proxy = this.top().getProxy(this.normalizePath(path));
      return this.stack.push(proxy);
    };

    ContextStack.prototype.pop = function() {
      if (this.stack.length === 0) {
        throw new Error("ContextStack:stack_underflow");
      }
      return this.stack.pop();
    };

    ContextStack.prototype.normalizePath = function(path) {
      if (this.isPath(path)) {
        return path.substring(1);
      } else if (path === '') {
        throw new Error("ContextStack:empty_path");
      } else {
        return path;
      }
    };

    ContextStack.prototype.isPath = function(path) {
      return path.indexOf('$') === 0;
    };

    ContextStack.prototype.get = function(path) {
      return this.top().get(this.normalizePath(path));
    };

    return ContextStack;

  })();

  Request = (function() {

    function Request() {}

    Request.successHandler = function(cb) {
      return function(data, status, xhr) {
        return cb(null, data);
      };
    };

    Request.errorHandler = function(cb) {
      var _this = this;
      return function(xhr, status, err) {
        var error;
        error = (function() {
          try {
            return new Exception(JSON.parse(xhr.responseText));
          } catch (e) {
            return e;
          }
        })();
        return cb(error, null);
      };
    };

    Request.getJSON = function(url, data, cb) {
      if (arguments.length === 2) {
        cb = data;
        data = {};
      }
      console.log('getJSON', url, data, cb);
      return $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'json',
        error: this.errorHandler(cb),
        success: this.successHandler(cb)
      });
    };

    Request.postJSON = function(url, data, cb) {
      var dataString;
      dataString = JSON.stringify(data);
      return $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: dataString,
        error: this.errorHandler(cb),
        success: this.successHandler(cb)
      });
    };

    return Request;

  })();

  testData = {
    accountHome: {
      id: 'e1d4f651-024e-4067-addf-719104924f91',
      name: 'test',
      ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
    },
    projects: [
      {
        id: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868',
        accountID: 'e1d4f651-024e-4067-addf-719104924f91',
        authors: ['e1d4f651-024e-4067-addf-719104924f91'],
        description: 'Test New Project',
        files: [],
        name: 'New Project',
        ownerID: 'e1d4f651-024e-4067-addf-719104924f91',
        posts: {
          '0298ae50-083e-450a-bc2d-4ea91ba3832e': 1,
          '930adbda-af26-4a18-a76f-7c159c15cbd0': 1,
          '9c8e8e61-0c03-476b-acb0-134fbee8ec19': 1
        },
        references: [],
        reviewers: [],
        slug: 'new-project',
        toc: [
          {
            id: '0298ae50-083e-450a-bc2d-4ea91ba3832e',
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868',
            slug: 'objective',
            title: 'Objective',
            nested: []
          }, {
            id: '930adbda-af26-4a18-a76f-7c159c15cbd0',
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868',
            title: 'test post',
            slug: 'test-post',
            nested: []
          }, {
            id: '9c8e8e61-0c03-476b-acb0-134fbee8ec19',
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868',
            title: '3rd Post',
            slug: '3rd-post',
            nested: []
          }
        ]
      }
    ]
  };

  mockLoggedIn = function(url, cb) {
    return cb(null, testData);
  };

  Account = (function(_super) {

    __extends(Account, _super);

    function Account() {
      Account.__super__.constructor.call(this, {});
    }

    Account.prototype.load = function() {
      var self;
      self = this;
      return mockLoggedIn('/user/login', function(err, res) {
        if (err) {
          console.error('/user/login:failed', err);
          throw err;
        } else {
          self.set('accountHome', res.accountHome);
          return self.set('projects', res.projects);
        }
      });
    };

    Account.prototype.getProjects = function() {
      return this.get('projects');
    };

    Account.prototype.getCurrentProject = function() {
      return this.get('currentProject');
    };

    return Account;

  })(Runtime.ObjectProxy);

  window.runtime = runtime = new Runtime($);

  test = function(stmt) {
    var anfRes, cpsExp, exp, func, source;
    exp = runtime.parse(stmt);
    anfRes = runtime.compiler.expToANF(exp);
    cpsExp = runtime.compiler.anfToCPS(anfRes);
    source = runtime.compiler.cpsToSource(cpsExp);
    func = runtime.compiler.compileExp(exp);
    console.log('*********************** TEST');
    console.log('   STMT', stmt);
    console.log('    EXP', JSON.stringify(exp, null, 2));
    console.log('    ANF', JSON.stringify(anfRes, null, 2));
    console.log('    CPS', JSON.stringify(cpsExp, null, 2));
    return console.log('COMPILE', func);
  };

  


  throttleAsync = function(func) {
    var helper, status;
    status = {
      called: false
    };
    helper = function() {
      console.log('throttleAsync.start', status);
      return func(function() {
        status.called = false;
        return console.log('throttleAsync.end', status);
      });
    };
    return function() {
      if (!status.called) {
        status.called = true;
        return setTimeout(helper, 200);
      } else {
        return console.log('callThrottled', status);
      }
    };
  };

  Runtime.registerFunc('power', Math.pow);

  Runtime.registerFunc('abs', Math.abs);

  Runtime.registerFunc('now', function() {
    return new Date();
  });

  AppNetLoader = (function() {

    function AppNetLoader(element, runtime, options) {
      var _base, _base1, _base2, _base3, _base4, _base5, _base6, _base7;
      this.element = element;
      this.runtime = runtime;
      this.options = options != null ? options : {};
      this.onScroll = __bind(this.onScroll, this);

      this.getOlderData = __bind(this.getOlderData, this);

      this.getLatestData = __bind(this.getLatestData, this);

      (_base = this.options).threshold || (_base.threshold = 0.8);
      (_base1 = this.options).maxLength || (_base1.maxLength = 50);
      (_base2 = this.options).interval || (_base2.interval = 1000);
      (_base3 = this.options).beforeKey || (_base3.beforeKey = 'before_id');
      (_base4 = this.options).sinceKey || (_base4.sinceKey = 'since_id');
      (_base5 = this.options).url || (_base5.url = 'https://alpha-api.app.net/stream/0/posts/stream/global');
      (_base6 = this.options).context || (_base6.context = 'appNet');
      (_base7 = this.options).idKey || (_base7.idKey = 'id');
      this.$ = this.runtime.$;
      this.getLatestData(function() {});
      this.refresh = throttleAsync(this.getLatestData);
    }

    AppNetLoader.prototype.getLatestData = function(cb) {
      var obj, params,
        _this = this;
      params = this.latestID ? (obj = {}, obj[this.options.sinceKey] = this.latestID, obj) : {};
      return $.getJSON(this.options.url, params, function(data, status, xhr) {
        var itemList;
        itemList = data.data.reverse();
        console.log("*** get more data", params, itemList);
        if (itemList.length > 0) {
          _this.latestID = itemList[itemList.length - 1][_this.options.idKey];
          if (_this.runtime.context.get(_this.options.context)) {
            _this.runtime.context.push(_this.options.context, itemList);
          } else {
            _this.runtime.context.set(_this.options.context, itemList);
            _this.oldestID = itemList[0][_this.options.idKey];
          }
          if (_this.runtime.context.get(_this.options.context).length > _this.options.maxLength) {
            console.log("*** pruning data");
            _this.runtime.context.splice(_this.options.context, 0, 20, []);
            _this.oldestID = _this.runtime.context.get(_this.options.context)[0].id;
          }
        }
        _this.$(_this.element).unbind('scroll', _this.onScroll);
        _this.$(_this.element).bind('scroll', _this.onScroll);
        return cb();
      });
    };

    AppNetLoader.prototype.getOlderData = function(cb) {
      var obj, params,
        _this = this;
      params = this.oldestID ? (obj = {}, obj[this.options.beforeKey] = this.oldestID, obj) : {};
      return $.getJSON(this.options.url, params, function(data, status, xhr) {
        var itemList;
        itemList = data.data.reverse();
        console.log("*** get older data", params, itemList);
        if (itemList.length > 0) {
          _this.latestID = itemList[itemList.length - 1][_this.options.idKey];
          if (_this.runtime.context.get(_this.options.context)) {
            _this.runtime.context.unshift(_this.options.context, itemList);
          } else {
            _this.runtime.context.set(_this.options.context, itemList);
          }
          if (_this.runtime.context.get(_this.options.context).length > _this.options.maxLength) {
            console.log("*** pruning data");
            _this.runtime.context.splice(_this.options.context, _this.runtime.context.get(_this.options.context).length - 20, 20, []);
          }
        }
        _this.$(_this.element).unbind('scroll', _this.onScroll);
        _this.$(_this.element).bind('scroll', _this.onScroll);
        return cb();
      });
    };

    AppNetLoader.prototype.destroy = function() {
      this.$(this.element).unbind('scroll', this.onScroll);
      return clearInterval(this.intervalID);
    };

    AppNetLoader.prototype.onScroll = function(evt) {
      var height, scrollHeight, scrollTop;
      scrollTop = this.$(this.element).scrollTop();
      scrollHeight = this.$(this.element)[0].scrollHeight;
      height = this.$(this.element).height();
      if (((height + scrollTop) / scrollHeight) > this.options.threshold) {
        this.$(this.element).unbind('scroll', this.onScroll);
        return this.refresh();
      }
    };

    return AppNetLoader;

  })();

  Runtime.registerWidget('appNet', AppNetLoader);

  $(function() {
    window.proxy = null;
    return mockLoggedIn('/user/login', function(err, res) {
      var milliSecond;
      if (err) {
        return console.log('/user/login:failed', err);
      } else {
        console.log('/user/login:success', res);
        runtime.context.set('accountHome', res.accountHome);
        runtime.context.set('projects', res.projects);
        runtime.context.set('foo', [
          {
            item: 'foo'
          }, {
            item: 'bar'
          }, {
            item: 'baz'
          }, {
            item: 'baw'
          }
        ]);
        runtime.context.set('stars', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        runtime.context.set('rating', 2);
        runtime.context.set('hightlight', 0);
        runtime.env.onScroll = function(cb) {
          return console.log('onScroll', runtime.$(this.element).height(), runtime.$(this.element).scrollTop(), $(this.element)[0].scrollHeight);
        };
        runtime.loadTemplates();
        runtime.initializeView(document);
        runtime.renderView('#test', 'test');
        runtime.renderView('#test', 'test-list');
        milliSecond = function() {
          var d;
          d = new Date();
          return runtime.context.set('currentMilliSecond', "" + (d.toString()) + "." + (d.getMilliseconds()));
        };
        setInterval(milliSecond, 100);
        return $(document).bind('mousemove', function(evt) {
          return runtime.context.set('mousePos', {
            left: evt.pageX,
            top: evt.pageY
          });
        });
      }
    });
  });

}).call(this);

  return module.exports;
})({exports: {}});


  return ___MAIN___;
});
