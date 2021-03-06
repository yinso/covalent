#
# the thing about this is... do we want to make out a template that we can instantiate?
# I think the general answer is yes.
# compiler creates the templates
#
# these are what's available in the template itself...
# i.e. the compilation should return the Binding Maker...
#
class BindingFactory
  @bindingTypes: {}
  @register: (type, bindingCtor) ->
    if @bindingTypes.hasOwnProperty(type)
      throw new Error("BindingFactory:duplicate_binding_type: #{type}")
    @bindingTypes[type] = bindingCtor
  @make: (type, prop, depends, callback, runtime) ->
    if not (@bindingTypes.hasOwnProperty(type))
      throw new Error("BindingFactory:unknown_binding_type: #{type}")
    new @ @bindingTypes[type], prop, depends, callback, runtime
  constructor: (@type, @prop, @depends, @callback, @runtime) ->
  destroy: () ->
    delete @runtime
    delete @callback
  make: (context, element) ->
    new @type context, element, @prop, @depends, @runtime, @callback

class EventBinding
  constructor: (@context, @element, @prop, @depends, @runtime, @callback) ->
    @bindElement @element
  destroy: () ->
    delete @context
    delete @element
    delete @runtime
    delete @callback
  rebind: (@context) ->
  bindElement: (@element) ->
    @runtime.$(@element).bind @prop, @eventRefresh
  unbindElement: (@element) ->
    @runtime.$(@element).unbind @prop, @eventRefresh
  refresh: (evt) => # this is empty as EventBinding only reacts to UI events...
  eventRefresh: (evt) =>
    console.log "#{@constructor.name}.refresh", evt
    @callback.call { runtime: @runtime, element: @element, context: @context, evt: evt }, @uponRefresh
  uponRefresh: (err, res) =>

BindingFactory.register 'on', EventBinding

class KeyupBinding extends EventBinding
  bindElement: (@element) ->
    @runtime.$(@element).bind 'keyup', @prop, @refresh
  unbindElement: (@element) ->
    @runtime.$(@element).unbind 'keyup', @prop, @refresh

BindingFactory.register 'keyup', KeyupBinding

class TextBinding # value from Proxy to UI
  constructor: (@context, @element, @prop, @depends, @runtime, @callback) ->
    @proxies = {}
    @bindProxies @context
    #@refresh {}
  destroy: () ->
    delete @context
    @unbindProxies()
    delete @runtime
    delete @element
  rebind: (context) ->
    @bindProxies context
    @refresh {}
  bindProxies: (@context) ->
    @unbindProxies()
    for key, val of @depends
      @bindProxy @context.getProxy key
  unbindProxies: () ->
    for key, proxy of @proxies
      @unbindProxy proxy
  bindProxy: (proxy) ->
    proxy.on 'set', @refresh
    proxy.on 'delete', @refresh
    proxy.on 'move', @onMove
    @proxies[proxy.prefix] = proxy
  unbindProxy: (proxy) ->
    proxy.removeListener 'set', @refresh
    proxy.removeListener 'delete', @refresh
    proxy.removeListener 'move', @onMove
    delete @proxies[proxy.prefix]
  refresh: (evt) =>
    #console.log "#{@constructor.name}.onRefresh", evt, @refresh
    @callback.call { runtime: @runtime, element: @element, context: @context, evt: evt }, @uponRefresh
  onMove: ({path, toPath, toProxy}) =>
    console.log 'TextBinding.onMove', path, toPath
    # how do I ensure this can be called twice without issues?
    if @proxies[path] # this is the easiest way, although a bit lazy
      @unbindProxy @proxies[path]
      @bindProxy toProxy
  uponRefresh: (err, res) =>
    if not err
      if typeof(window) != 'undefined' and @element instanceof window.HTMLTitleElement
        @runtime.$(@element.ownerDocument).attr('title', @flattenVal(res))
      else
        @runtime.$(@element).html @flattenVal(res)
  flattenVal: (res) =>
    if res instanceof Object then JSON.stringify(res) else res

BindingFactory.register('text', TextBinding)

class AttrBinding extends TextBinding
  uponRefresh: (err, res) =>
    #console.log "AttrBinding.refresh", err, evt, res
    if not err
      if @prop == 'style'
        @runtime.$(@element).css res
      else
        @runtime.$(@element).attr @prop, @flattenVal(res)

BindingFactory.register('attr', AttrBinding)

class ClassBinding extends TextBinding
  uponRefresh: (err, res) =>
    if res
      @runtime.$(@element).addClass @prop
    else
      @runtime.$(@element).removeClass @prop

BindingFactory.register 'class', ClassBinding

module.exports = BindingFactory
