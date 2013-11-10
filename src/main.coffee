{EventEmitter} = require 'events'

$ = require 'jquery'
ObjectProxy = require './object'
TemplateFactory = require './template'
Compiler = require './compiler'
Runtime = require './runtime'
window.Coffee = require 'coffee-script'

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
  account:
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



$  ->
  window.runtime = runtime = new Runtime($)
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

