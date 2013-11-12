
###


###


class Template
  @make: (template, runtime) ->
    new @ template, runtime
  constructor: (@template, @runtime) ->
    $ = @runtime.$
    @inner = $(@template)[0]
    @bindingFactories = []
    for boundElt, i in $(@inner).filter('[data-bind]').add('[data-bind]', @inner).toArray()
      bindings = @runtime.compile $(boundElt).data('bind')
      if bindings instanceof Array
        @bindingFactories.push bindings
      else
        throw new Error("Template:parse_binding_unsupported")
  destroy: () ->
    delete @runtime
    for factory in @bindingFactories
      factory.destroy()
  make: (context) ->
    new UIView context, @, @runtime
  clone: () ->
    @runtime.$(@inner).clone()[0]

class UIView
  constructor: (@context, @template, @runtime) ->
    @$ = runtime.$
    @bindings = []
    @inner = @makeView()
    @children = []
    @bindProxy @context
  destroy: () ->
    delete @runtime
    @unbindProxy @context
    delete @context
    delete @template
    @$(@inner).remove()
    delete @inner
    delete @$
    for binding in @bindings
      binding.destroy()
    for child in @children
      child.destroy()
  rebind: (context) ->
    @unbindProxy()
    @bindProxy context
    for binding in @bindings
      binding.rebind context
  bindProxy: (@context) ->
    @context.on 'move', @onMove
  unbindProxy: (context) ->
    @context.removeListener 'move', @onMove
    @context = null
  onMove: (evt) =>
    {path, toPath, toProxy} = evt
    @rebind toProxy
  makeView: () ->
    view = @template.clone()
    boundElements = $(view).filter('[data-bind]').add('[data-bind]', view).toArray()
    if boundElements.length != @template.bindingFactories.length
      throw new Error("Template.ctor:mismatch_bindings_length")
    for i in [0...boundElements.length]
      for bindingFactory in @template.bindingFactories[i]
        @bindings.push bindingFactory.make @context, boundElements[i]
    view
  refresh: (evt = {}) ->
    for binding in @bindings
      binding.refresh evt
  prependTo: (@element) ->
    @$(@element).prepend @inner
  appendTo: (@element) ->
    @$(@element).append @inner
  appendAfter: (template) ->
    @$(template.inner).after @inner
  detach: () ->
    if @element
      @$(@element).detach @inner

class TemplateManager
  constructor: (@$, @runtime) ->
    console.log "TemplateManager.ctor"
    @templates = {}
    @instances = {}
  destroy: () ->
    delete @$
    delete @runtime
    for key, template of @templates
      template.destroy()
  load: () ->
    for script in @$('script[type="text/template"]').toArray()
      name = @$(script).data('template-name')
      template = Template.make(@$(script).html(), @runtime) # by default we don't have enough info to make eachTemplate.... OK.
      if @templates.hasOwnProperty(name)
        throw new Error("TemplateManager.duplicate_template_name: #{name}")
      @templates[name] = template
  get: (name) ->
    if not @templates.hasOwnProperty(name)
      throw new Error "TemplateManager.unknown_template: #{name}"
    @templates[name]
  makeView: (tplName, element, context = @runtime.context.getProxy('.')) ->
    if not @templates.hasOwnProperty(tplName)
      throw new Error "TemplateManager.unknown_template: #{tplName}"
    view = @templates[tplName].make context
    view.appendTo element
    view
  setView: (name, tplName, element, context = @runtime.context.getProxy('.')) ->
    view = @makeView tplName, element, context
    @instances[name] = view
    view.refresh {}
    view

module.exports = TemplateManager
