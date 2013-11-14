
Compiler = require './compiler'
TemplateManager = require './template'
WidgetFactory = require './widget'
ObjectProxy = require './object'

builtIn = {}

builtIn.delay = (milli, val, cb) ->
  id = null
  helper = () =>
    clearTimeout id
    cb null, val
  id = setTimeout helper, milli

class Runtime
  @ObjectProxy: ObjectProxy
  @registerWidget: (name, widget) ->
    WidgetFactory.register name, widget
  @registerFunc: (name, proc) ->
    if not proc instanceof Function
      throw new Error("Runtime.registerFunc:not_a_function: #{proc}")
    if builtIn.hasOwnProperty(name)
      throw new Error("Runtime.registerFunc:name_already_in_use: #{name}")
    helper = () ->
      cb = arguments[arguments.length - 1]
      args = (arguments[i] for i in [0...arguments.length - 1])
      self = this
      try
        res = proc.apply this, args
        cb null, res
      catch e
        cb e
    builtIn[name] = helper
  @registerAsyncFunc: (name, proc) ->
    if not proc instanceof Function
      throw new Error("Runtime.registerFunc:not_a_function: #{proc}")
    if builtIn.hasOwnProperty(name)
      throw new Error("Runtime.registerFunc:name_already_in_use: #{name}")
    builtIn[name] = proc
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

module.exports = Runtime