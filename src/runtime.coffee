
Compiler = require './compiler'
TemplateFactory = require './template'
ObjectProxy = require './object'

class Runtime
  constructor: (@$, data = {}) -> # we take in jQuery...
    @compiler = new Compiler @
    @factory = new TemplateFactory @$, @
    @context = new ObjectProxy(data)
    @templates = {}
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