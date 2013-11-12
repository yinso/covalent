
Compiler = require './compiler'
TemplateManager = require './template'
WidgetFactory = require './widget'
ObjectProxy = require './object'

class Timer
  constructor: (@milli, @thunk) ->
  run: () ->
    @id = setTimeout @callMe, @milli
  callMe: () =>
    clearTimeout @id
    @thunk()

builtIn = {}

builtIn.delay = (milli, val, cb) ->
  helper = () =>
    #console.log 'delay', milli, val, cb
    cb null, val
  timer = new Timer milli, helper
  timer.run()

builtIn.foo = () ->
  cb = arguments[arguments.length - 1]
  res = 0
  for i in [0...arguments.length - 1]
    res += arguments[i]
  # we are going to do nothing with this function.
  cb null, res

builtIn.bar = (cb) ->
  cb = arguments[arguments.length - 1]
  res = 0
  for i in [0...arguments.length - 1]
    res += arguments[i]
  # we are going to do nothing with this function.
  cb null, res

builtIn.baz = (cb) ->
  cb = arguments[arguments.length - 1]
  res = 0
  for i in [0...arguments.length - 1]
    res += arguments[i]
  # we are going to do nothing with this function.
  cb null, res


class Runtime
  constructor: (@$, data = {}) -> # we take in jQuery...
    @compiler = new Compiler @
    @factory = new TemplateManager @
    @context = new ObjectProxy(data)
    @env = builtIn # this is the environment to be used for compilation!
  compile: (stmt) ->
    @compiler.compile stmt, @ # pass oneself in...
  parse: (stmt) ->
    @compiler.parse stmt
  loadTemplates: () ->
    @factory.load()
  renderView: (element, tplName, context = @context.getProxy('.')) ->
    @factory.setView element, tplName, context
  initializeView: (element) ->
    @factory.initializeView element
  registerWidget: (name, widget) ->
    WidgetFactory.register name, widget




module.exports = Runtime