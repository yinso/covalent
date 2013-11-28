BindingFactory = require './binding'

class WidgetFactory
  @widgets: {}
  @register: (name, widget) ->
    if @widgets.hasOwnProperty(name)
      throw new Error("widget_already_defined: #{name}")
    else
      @widgets[name] = widget
  constructor: (@context, @element, @prop, @depends, @runtime, @callback) ->
    if not @constructor.widgets.hasOwnProperty(@prop)
      throw new Error "unknown_widget_type: #{@prop}"
  destroy: () ->
    @widget?.destroy()
    delete @context
    delete @runtime
    delete @element
  refresh: (evt) =>
    if not @widget
      @callback.call { runtime: @runtime, element: @element, context: @context, evt: evt }, (err, res) =>
        @widget = new @constructor.widgets[@prop] @element, @runtime, res

BindingFactory.register 'widget', WidgetFactory

module.exports = WidgetFactory
