
###


###


class Template
  @make: (template, runtime, noClone = false) ->
    element = runtime.$(template)[0]
    new @ element, runtime
  constructor: (@element, @runtime, @noClone = false) ->
    @$ = @runtime.$
    @bindingFactories = []
    for boundElt, i in @$(@element).filter('[data-bind]').add('[data-bind]', @element).toArray()
      bindings = @runtime.compile @$(boundElt).data('bind')
      if bindings instanceof Array
        @bindingFactories.push bindings
      else
        throw new Error("Template:parse_binding_unsupported")
  destroy: () ->
    if not @noClone # the template manages the element.
      @$(@element).remove()
    delete @$element
    delete @$
    delete @runtime
    for factory in @bindingFactories
      factory.destroy()
  make: (context) ->
    new UIView context, @, @runtime
  clone: () ->
    if @noClone
      @element
    else
      @$(@element).clone()[0]

class UIView
  constructor: (@context, @template, @runtime) ->
    @$ = runtime.$
    @bindings = []
    @element = @initialize()
    @children = []
    @bindProxy @context
  destroy: () ->
    delete @runtime
    @unbindProxy @context
    delete @context
    delete @template
    @$(@element).remove()
    delete @element
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
  initialize: () ->
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
  prependTo: (@parent) ->
    @$(@parent).prepend @element
  appendTo: (@parent) ->
    @$(@parent).append @element
  appendAfter: (template) ->
    @$(template.element).after @element
  detach: () ->
    if @parent
      @$(@parent).detach @element

class TemplateManager
  constructor: (@runtime) ->
    @$ = @runtime.$
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
  uniqueID: () ->
    if not @id
      @id = 1
    "__covalent_#{@id++}"
  elementID: (element) ->
    id = @$(element).data('__covalent_id')
    if not id
      id = @uniqueID()
      @$(element).data('__covalent_id', id)
    id
  get: (name) ->
    if not @templates.hasOwnProperty(name)
      throw new Error "TemplateManager.unknown_template: #{name}"
    @templates[name]
  makeView: (element, tplName, context = @runtime.context.getProxy('.')) ->
    if not @templates.hasOwnProperty(tplName)
      throw new Error "TemplateManager.unknown_template: #{tplName}"
    view = @templates[tplName].make context
    view.appendTo element
    view
  setView: (element, tplName, context = @runtime.context.getProxy('.')) ->
    view = @makeView element, tplName, context
    @instances[@elementID(view.element)] = view
    view.refresh {}
    view
  initializeView: (element, context = @runtime.context.getProxy('.')) ->
    # does this template exist? that'll be the question...
    # template can exist by name and it can exist by element as well...
    template = Template.make element, @runtime, true
    view = template.make context # this is automatically bound to the element as the element.
    @instances[@elementID(element)] = view
    view.refresh {}
    view

    # we are going to skip quite a bit of work here....


module.exports = TemplateManager
