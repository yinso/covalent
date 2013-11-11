
Compiler = require './compiler'
TemplateFactory = require './template'
ObjectProxy = require './object'

class Timer
  constructor: (@milli, @thunk) ->
  run: () ->
    @id = setTimeout @callMe, @milli
  callMe: () =>
    clearTimeout @id
    @thunk()

builtIn = {}
builtIn.delay = (milli, path, val, cb) ->
  helper = () =>
    cb null, @context.set path, val
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
    @factory = new TemplateFactory @$, @
    @context = new ObjectProxy(data)
    @templates = {}
    @env = builtIn # this is the environment to be used for compilation!
  compile: (stmt) ->
    @compiler.compile stmt, @ # pass oneself in...
  parse: (stmt) ->
    @compiler.parse stmt
  loadTemplates: () ->
    @factory.load()
  renderView: (tplName, element, context = @context.getProxy('.')) ->
    view = @factory.makeView tplName, element, context
    view.appendTo element
    @templates[tplName] = view # let's ensure that this is




module.exports = Runtime