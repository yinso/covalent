{EventEmitter} = require 'events'

$ = require 'jquery'
ObjectProxy = require './object'
TemplateFactory = require './template'
Compiler = require './compiler'
Runtime = require './runtime'
window.Coffee = require 'coffee-script'
testCompiler = window.testCompiler = require '../test/compiler'

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

class Account extends ObjectProxy
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
###
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
###

$  ->
  window.proxy = null

  mockLoggedIn '/user/login', (err, res) ->
    if err
      console.log '/user/login:failed', err
    else
      console.log '/user/login:success', res
      runtime.context.set 'accountHome', res.accountHome
      runtime.context.set 'projects', res.projects
      runtime.context.set 'foo', [
          {item: 'foo'}
          {item: 'bar'}
          {item: 'baz'}
          {item: 'baw'}
          ]
      # let's load a template onto
      runtime.loadTemplates()
      runtime.renderView 'test', '#test'
      runtime.renderView 'test-list', '#test'
      milliSecond = () ->
        d = new Date()
        runtime.context.set 'currentMilliSecond', "#{d.toString()}.#{d.getMilliseconds()}"
      setInterval milliSecond, 100
      $(document).bind 'mousemove', (evt) ->
          runtime.context.set 'mousePos', {left: evt.pageX, top: evt.pageY}
      # how would we be able to do something similar to flapjax example?
      # timerB(100) => this is something that'll generate event by itself!


