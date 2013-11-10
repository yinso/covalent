
# each template is never created manually - it's always created through
# the @each binding. So in effect this is a private class.
# this is really a binding... hmm...
class EachTemplate
  constructor: (@contextPath, @templateName, @runtime) -> # is this enough?
  destroy: () ->
    delete @runtime
  make: (context, element) ->
    if not @template
      @template = @runtime.factory.get(@templateName)
    new EachUIView context.getProxy(@contextPath), element, @contextPath, @template, @runtime

# each UI view is also
class EachUIView
  constructor: (@context, @element, @prop, @template, @runtime) ->
    @children = []
    @bindProxy @context
    @refresh {}
  rebind: (context) ->
    @unbindProxy context
    @bindProxy context
    for template, i in @children
      template.rebind @context.getProxy(i)
  bindProxy: (proxy) ->
    proxy.on 'set', @onSet
    proxy.on 'delete', @onDelete
    proxy.on 'move', @onMove
    proxy.on 'splice', @onSplice
    @context = proxy
  unbindProxy: (proxy) ->
    proxy.removeListener 'set', @onSet
    proxy.removeListener 'delete', @onDelete
    proxy.removeListener 'move', @onMove
    proxy.removeListener 'splice', @onSplice
    @context = null
  onMove: (evt) =>
    {path, toPath, toProxy} = evt
    console.log 'EachUIView.move', path, toPath, toProxy, @element
    @unbindProxy @context
    @bindProxy toProxy
  destroy: () ->
    delete @$
    delete @runtime
    delete @template
    @unbindProxy @context
    delete @context
    for child in @children
      child.destroy()
    delete @element
  spliceRefresh: ({index, removed, inserted}) ->
    console.log 'EachUIView.spliceRefresh', index, removed, inserted
    insertedLength = inserted?.length or 0
    removedLength = removed?.length or 0
    shiftDiff = insertedLength - removedLength
    # we only add the items that come about as inbalance between insert & remove
    # (the other items will come in as SET)
    if shiftDiff > 0
      for i in [(index + removedLength)...(index + insertedLength)]
        @addItem i
    else if shiftDiff < 0
      for i in [(index + removedLength - 1)...(index + insertedLength - 1)] by -1
        # remove backwards so we won't cause index destabilization
        @removeItem i
  refresh: () ->
    # let's get the value...
    values = @context.get('.')
    if not (values instanceof Array)
      return
      # do nothing...
    else # let's add everything one by one.
      @spliceRefresh {index: 0, removed: 0, inserted: values}
      # see even in here the @element doesn't make sense.
      #for item, i in values
      #  @addItem i
  onSet: (evt) =>
    @spliceRefresh index: 0, removed: evt.oldVal, inserted: evt.newVal
  onDelete: (evt) =>
    @spliceRefresh index: 0, removed: evt.oldVal, inserted: []
  onSplice: (evt) =>
    @spliceRefresh evt
  addItem: (i) ->
    template = @template.make @context.getProxy(i)
    if i == 0
      template.prependTo @element
      @children.unshift template
    else
      prev = @children[i - 1]
      if not prev
        throw new Error("EachUIView.gap_in_children: #{i}")
      template.appendAfter prev
      @children.splice i, 0, template
  removeItem: (i) ->
    console.log 'EachUIView.removeItem', i
    template = @children[i]
    if not template
      throw new Error("EachUIView.removeItem:already_removed: #{i}")
    template.destroy()
    @children.splice i, 1


#BindingFactory.register 'each', EachUIView

module.exports = EachTemplate