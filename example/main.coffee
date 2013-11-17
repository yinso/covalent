{EventEmitter} = require 'events'

$ = require 'jquery'
Runtime = require 'covalent'
require 'jquery.address'
require 'jquery.form'

class ContextStack
  constructor: (context) ->
    @stack = [ context ]
  top: () ->
    if @stack.length == 0
      throw new Error("ContextStack:stack_empty")
    @stack[@stack.length - 1]
  push: (path) ->
    proxy = @top().getProxy(@normalizePath(path))
    @stack.push proxy
  pop: () ->
    if @stack.length == 0
      throw new Error("ContextStack:stack_underflow")
    @stack.pop()
  normalizePath: (path) ->
    if (@isPath(path))
      path.substring(1)
    else if path == ''
      throw new Error("ContextStack:empty_path")
    else
      path
  isPath: (path) ->
    path.indexOf('$') == 0
  get: (path) ->
    @top().get(@normalizePath(path))


# these classes cannot be used in the backend based on the way it's
# designed... i.e. these are strictly frontend code.
# if we want something that works in the frontend as well as the
# backend we'll have to let jquery be passed in... and in that
# case pretty much every single class will have to become an instance.
class Request
  @successHandler: (cb) ->
    (data, status, xhr) ->
      cb null, data
  @errorHandler: (cb) ->
    (xhr, status, err) =>
      error =
        try
          new Exception(JSON.parse xhr.responseText)
        catch e
          e
      cb error, null
  @getJSON: (url, data, cb) ->
    if arguments.length == 2
      cb = data
      data = {}
    console.log 'getJSON', url, data, cb
    $.ajax
      type: 'GET'
      url: url
      data: data
      dataType: 'json'
      error: @errorHandler(cb)
      success: @successHandler(cb)
  @postJSON = (url, data, cb) ->
    dataString = JSON.stringify data
    $.ajax
      type: 'POST'
      url: url
      dataType: 'json'
      contentType: 'application/json'
      data: dataString
      error: @errorHandler cb
      success: @successHandler cb

testData =
  accountHome:
    id: 'e1d4f651-024e-4067-addf-719104924f91'
    name: 'test'
    ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
  projects:
    [
      {
        id: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
        accountID: 'e1d4f651-024e-4067-addf-719104924f91'
        authors: ['e1d4f651-024e-4067-addf-719104924f91']
        description: 'Test New Project'
        files: []
        name: 'New Project'
        ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
        posts:
          '0298ae50-083e-450a-bc2d-4ea91ba3832e': 1
          '930adbda-af26-4a18-a76f-7c159c15cbd0': 1
          '9c8e8e61-0c03-476b-acb0-134fbee8ec19': 1
        references: []
        reviewers: []
        slug: 'new-project'
        toc: [
          {
            id: '0298ae50-083e-450a-bc2d-4ea91ba3832e'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            slug: 'objective'
            title: 'Objective'
            nested: []
          }
          {
            id: '930adbda-af26-4a18-a76f-7c159c15cbd0'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            title: 'test post'
            slug: 'test-post'
            nested: []
          }
          {
            id: '9c8e8e61-0c03-476b-acb0-134fbee8ec19'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            title: '3rd Post'
            slug: '3rd-post'
            nested: []
          }
        ]
      }
    ]

# to transform code from sync to async - the approach is
# to basically make the continuation explicit.
#
# the basic approach is this - lift out the arguments, and place them higher on the stack.
# foo() + bar()
# => {op: '+', lhs: {funcall: {id: 'foo'}, args: []}, rhs: {funcall: {id: 'bar'}, args: []}}
# =>
# [
#   {arg1: {funcall: {id: 'foo'}, args: []}}
#   {arg2: {funcall: {id: 'bar'}, args: []}}
#   {op: '+', lhs: 'arg1', rhs: 'arg2'}
# ]
# =>
# {funcall: {id: 'foo'}, args: [
#   {function: '', args: ['err1', 'arg1'], body: [
#     {funcall: {id: 'bar'}, args: [
#       {function: '', args: ['err2', 'arg2'], body: [
#          {op: '+', lhs: 'arg1', rhs: 'arg2'}]}]}]}]}
#
# it's in a way a 2 stage transformation -> first to lift the args, and then second to fill in the chains.
# {
# 1 + 1
# 2
# }
# block [ { 1 + 1} { 2 } ] => we still should retain its *blockness*.
# x = foo()
# y = bar()
# z = x + y + baz()
#
# because everything can be an expression so we should end up assigning the result
# to a variable.
# 1 + (if foo() { bar() } else { baz() }
#
#
# should translate to
# foo (err, res) ->
#  if err then return cb err
#  if res
#    bar (err2, res2) ->
#     if err2 then cb err2
#     cb null, 1 + res2
#  else
#    baz (err3, res3) ->
#      if err3 then cb err3
#      cb null, 1 + res3
#
# once a while though this would translate into something that won't have a continuation...
# we'll need to think through how that works.
# OK - we'll probably need to rewrite the way the code is written??
# currently - we try to pop in what's earlier, but when it comes to if (where things got split in 2)
# we got in trouble. i.e. it should be branched into two parts...
# we can argue that we'll put the rest of the code into a single section so it'll be called from both.
# (but this is strictly speaking not necessary).


mockLoggedIn = (url, cb) ->
  cb null, testData
# since we are fully capable now to create a class let's start to come up with some patterns for use
# 1 - all class objects are EventEmitter - this is already easy to handle now.
# 2 - we can handle all of the work directly from event Emitter...

class Account extends Runtime.ObjectProxy
  constructor: () ->
    super {}
  load: () ->
    self = @
    mockLoggedIn '/user/login', (err, res) ->
      if err
        console.error '/user/login:failed', err
        throw err
      else
        self.set 'accountHome', res.accountHome
        self.set 'projects', res.projects
  getProjects: () ->
    @get 'projects'
  getCurrentProject: () ->
    @get 'currentProject'


window.runtime = runtime = new Runtime($)

runtime.app.get '/', (req) ->
  console.log "path: /", req

runtime.app.get '/:project', (req) ->
  console.log "pathProject", req.url, req

runtime.app.get '/test', (req) ->
  console.log "path", req.url, req

###
test = (stmt) ->
  exp = runtime.parse(stmt)
  anfRes = runtime.compiler.expToANF(exp)
  cpsExp = runtime.compiler.anfToCPS anfRes
  source = runtime.compiler.cpsToSource cpsExp
  func = runtime.compiler.compileExp exp
  console.log '*********************** TEST'
  console.log '   STMT', stmt
  console.log '    EXP', JSON.stringify(exp, null, 2)
  console.log '    ANF', JSON.stringify(anfRes, null, 2)
  console.log '    CPS', JSON.stringify(cpsExp, null, 2)
  #console.log 'COMPILE', source
  console.log 'COMPILE', func
test '1'
test '1 + 1'
test '1 * (2 + 1)'
test 'foo()'
test '1 + foo()'
test '1 + foo(2) + bar(3, 4)'
test 'if 1 == 3 { foo() } else { bar() }'
test '1 + (if 1 == 1 { foo(1) } else { bar(2) })'
test '1 + (if 1 == 0 { foo(1) baz(2) } else { bar(2) })'
test 'baz({foo: 1, bar: 1 + bar() })'


    _.throttle = function(func, wait, options) {
    var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
  previous = new Date;
  timeout = null;
  result = func.apply(context, args);
  };
  return function() {
  var now = new Date;
  if (!previous && options.leading === false) previous = now;
  var remaining = wait - (now - previous);
  context = this;
  args = arguments;
  if (remaining <= 0) {
  clearTimeout(timeout);
    timeout = null;
    previous = now;
    result = func.apply(context, args);
  } else if (!timeout && options.trailing !== false) {
timeout = setTimeout(later, remaining);
  }
  return result;
  };
  };


###


# to throttle a call...
# it basically does this...
# 1 - a function - as soon as it's called, it's protected by a *lock*...
throttleAsync = (func) ->
  status = {called: false}
  helper = () ->
    console.log 'throttleAsync.start', status
    func () ->
      status.called = false # this should be used with async...???
      console.log 'throttleAsync.end', status
  () ->
    if not status.called
      status.called = true # immediately stop it... (can it fire fast enough to disrupt this???).
      setTimeout(helper, 200) # how do we clear out the timeout afterwards? don't worry about this for now.
    else
      console.log 'callThrottled', status


Runtime.registerFunc 'power', Math.pow
Runtime.registerFunc 'abs', Math.abs
Runtime.registerFunc 'now', () -> new Date()

# in order to slow down the firing... we should do something the following...
# 1 - set the firing to be true (multiple of them will set it the same way).
# 2 - have an interval poll to retrieve the data call.
# 3 - only rebind after successfully retrieving the call
class AppNetLoader
  constructor: (@element, @runtime, @options = {}) ->
    @options.threshold ||= 0.8
    @options.maxLength ||= 50 # total number of items we want to have in the list.
    @options.interval ||= 1000
    @options.beforeKey ||= 'before_id'
    @options.sinceKey ||= 'since_id'
    @options.url ||= 'https://alpha-api.app.net/stream/0/posts/stream/global'
    @options.context ||= 'appNet'
    @options.idKey ||= 'id'
    @$ = @runtime.$
    @getLatestData () ->
    @refresh = throttleAsync @getLatestData
  # to have it the other way around - we'll need to have the data being auto-scrolled down (and prevent
  # the old data from being fired...).
  getLatestData: (cb) => # time to figure out how to get the next sets of data based on threshold...
    params =
      if @latestID
        obj = {}
        obj[@options.sinceKey] = @latestID
        obj
      else
        {}
    $.getJSON @options.url, params, (data, status, xhr) =>
      itemList = data.data.reverse()
      console.log "*** get more data", params, itemList
      if itemList.length > 0
        @latestID = itemList[itemList.length - 1][@options.idKey]
        if @runtime.context.get(@options.context)
          @runtime.context.push(@options.context, itemList)
        else
          @runtime.context.set(@options.context, itemList)
          @oldestID = itemList[0][@options.idKey]
        if @runtime.context.get(@options.context).length > @options.maxLength
          console.log "*** pruning data"
          @runtime.context.splice(@options.context, 0, 20, []) # prune the prefix list...
          @oldestID = @runtime.context.get(@options.context)[0].id
      @$(@element).unbind 'scroll', @onScroll
      @$(@element).bind 'scroll', @onScroll
      cb()
  getOlderData: (cb) =>
    params =
      if @oldestID
        obj = {}
        obj[@options.beforeKey] = @oldestID
        obj
      else
        {}
    $.getJSON @options.url, params, (data, status, xhr) =>
      itemList = data.data.reverse()
      console.log "*** get older data", params, itemList
      if itemList.length > 0
        @latestID = itemList[itemList.length - 1][@options.idKey]
        if @runtime.context.get(@options.context)
          @runtime.context.unshift(@options.context, itemList)
        else
          @runtime.context.set(@options.context, itemList)
        if @runtime.context.get(@options.context).length > @options.maxLength
          console.log "*** pruning data"
          @runtime.context.splice(@options.context, @runtime.context.get(@options.context).length - 20, 20, [])
          # prune the prefix list...
      @$(@element).unbind 'scroll', @onScroll
      @$(@element).bind 'scroll', @onScroll
      cb()
  destroy: () ->
    @$(@element).unbind 'scroll', @onScroll
    clearInterval @intervalID
  onScroll: (evt) =>
    scrollTop = @$(@element).scrollTop()
    scrollHeight = @$(@element)[0].scrollHeight
    height = @$(@element).height()
    if ((height + scrollTop) / scrollHeight) > @options.threshold
      @$(@element).unbind 'scroll', @onScroll
      @refresh()

Runtime.registerWidget 'appNet', AppNetLoader

$  ->
  window.proxy = null

  mockLoggedIn '/user/login', (err, res) ->
    if err
      console.log '/user/login:failed', err
    else
      console.log '/user/login:success', res
      runtime.context.set 'accountHome', res.accountHome
      runtime.context.set 'account1', {id: 'test-id', name: 'test', ownerID: 'test-id'}
      runtime.context.setAlias 'test', 'accountHome'
      runtime.context.getProxy('test.id').on 'set', (evt) -> console.log 'test.id.set', evt
      runtime.context.getProxy('accountHome.id').on 'set', (evt) -> console.log 'accountHome.id.set', evt
      runtime.context.getProxy('account1.id').on 'set', (evt) -> console.log 'account1.id.set', evt
      runtime.context.set 'projects', res.projects
      runtime.context.set 'foo', [
          {item: 'foo'}
          {item: 'bar'}
          {item: 'baz'}
          {item: 'baw'}
          ]
      runtime.context.set 'stars', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      runtime.context.set 'rating', 2
      runtime.context.set 'hightlight', 0
      runtime.env.onScroll = (cb) -> # where is the particular widget that's mapped to???
        console.log 'onScroll', runtime.$(@element).height(), runtime.$(@element).scrollTop(), $(@element)[0].scrollHeight

      # let's load a template onto
      runtime.loadTemplates()
      runtime.initializeView document
      runtime.renderView '#test', 'test'
      runtime.renderView '#test', 'test-list'
      milliSecond = () ->
        d = new Date()
        runtime.context.set 'currentMilliSecond', "#{d.toString()}.#{d.getMilliseconds()}"
      setInterval milliSecond, 100
      $(document).bind 'mousemove', (evt) ->
        runtime.context.set 'mousePos', {left: evt.pageX, top: evt.pageY}

#scrollerBottom = event.node.getBoundingClientRect().bottom;
#listBottom = this.nodes.stream.getBoundingClientRect().bottom;
