{EventEmitter} = require 'events'

# this ought to be eventEmitter too I guess!
# what should really happen?
# let's think through... we can channel everything to a single place.
#
# Alias -> emit -> inner -> emit -> ... not the right idea.
# these things don't retain their original value -> the only thing that'll change
# is the prefix! prefect!
class ProxyAlias extends EventEmitter
  constructor: (@inner, @prefix) ->
  _normalizePath: (path) ->
    if @prefix == ''
      path
    else if path == '.'
      @prefix
    else
      [ @prefix, path ].join '.'
  get: (path) ->
    @inner.get @_normalizePath(path)
  set: (path, val) ->
    @inner.set @_normalizePath(path), val
  delete: (path) ->
    @inner.delete @_normalizePath(path)
  splice: (path, index, removedCount, inserted) ->
    @inner.splice @_normalizePath(path), index, removedCount, inserted
  push: (path, inserted) ->
    @inner.push @_normalizePath(path), inserted
  pop: (path) ->
    @inner.pop @_normalizePath(path)
  shift: (path) ->
    @inner.shift @_normalizePath(path)
  unshift: (path, inserted) ->
    @inner.unshift @_normalizePath(path), inserted
  getProxy: (path) ->
    @inner.getProxy @_normalizePath(path)
  hasProxy: (path) ->
    @inner.hasProxy @_normalizePath(path)

class ProxyMap
  constructor: (@root) ->
    @proxies = {}
    @root.on 'set', @_callSet
    @root.on 'delete', @_callDelete
    @root.on 'splice', @_callSplice
    @root.on 'move', @_callMove
  hasProxy: (path) ->
    if @proxies.hasOwnProperty(path)
      @proxies[path]
    else
      undefined
  getProxy: (path) ->
    if path == '.'
      path = ''
    proxy = @hasProxy path
    if not proxy
      @addProxy path
    else
      proxy
  addProxy: (path) ->
    proxy = new ProxyAlias @root, path
    @proxies[proxy.prefix] = proxy
    proxy
  setAlias: (path, path2) ->
    # will this work appropriately?
    # i.e. what happens when we set the path value?
    proxy = @getProxy path
    proxy.prefix = path2
    proxy
  _inLeft: (current, val) ->
    result = {}
    for k, v of current
      if current.hasOwnProperty(k) and not val.hasOwnProperty(k)
        result[k] = v
    result
  _modified: (current, val, left = {}, right = {}) ->
    for k, v of current
      if current.hasOwnProperty(k) and val.hasOwnProperty(k)
        if v != val[k]
          left[k] = v
          right[k] = val[k]
    [ left , right ]
  _callSet: (evt) =>
    console.log 'ObjectProxy.set', evt
    proxy = @hasProxy(evt.path) # without this it means no binding.
    if proxy
      @_recurseSet proxy, evt
  _recurseSet: (proxy, evt) ->
    {path, oldVal, newVal} = evt
    if (oldVal instanceof Object) and (newVal instanceof Object) # this requires us to figure out the differences.
      removed = @_inLeft oldVal, newVal
      inserted = @_inLeft newVal, oldVal
      [ left , right ] = @_modified oldVal, newVal, {}, inserted
      @_recurseDeleteInner proxy, {type: 'delete', path: path, oldVal: removed}
      @_recurseSetInner proxy, {type: 'set', path: path, oldVal: left, newVal: right}
    else if not (oldVal instanceof Object) # this is just recurseSet of the inner values.
      @_recurseSetInner proxy, {type: 'set', path: path, oldVal: {}, newVal: newVal}
    else if not (newVal instanceof Object) # just recurseDelete the inner objects.
      @_recurseDeleteInner proxy, {type: 'delete', path: path, oldVal: oldVal}
    else # neither is an object - we will do nothing.
      null
    console.log 'ObjectProxy.recurseSet', evt
    proxy.emit 'set', evt
  _recurseSetInner: (proxy, evt) ->
    {path, oldVal, newVal} = evt
    for key, val of newVal
      if newVal.hasOwnProperty(key)
        innerPath = "#{path}.#{key}"
        innerProxy = @hasProxy innerPath # not creating new proxy if it doesn't exist.
        if innerProxy
          @_recurseSet innerProxy, {type: 'set', path: innerPath, oldVal: oldVal[key], newVal: val}
  _callDelete: (evt) =>
    console.log 'ObjectProxy.delete', evt
    proxy = @hasProxy(evt.path)
    if proxy
      @_recurseDelete proxy, evt
  _recurseDelete: (proxy, evt) ->
    @_recurseDeleteInner proxy, evt
    console.log 'ObjectProxy.recurseDelete', evt
    proxy.emit 'delete', evt
  _recurseDeleteInner: (proxy, evt) ->
    {path, oldVal} = evt
    # based on the path we should get a list of existing availble binding.
    if (oldVal instanceof Object)
      for key, val of oldVal
        if oldVal.hasOwnProperty(key)
          innerPath = "#{path}.#{key}"
          inner = @hasProxy innerPath
          if inner
            @_recurseDelete inner, {type: 'delete', path: innerPath, oldVal: val}
  _callSplice: (evt) =>
    console.log 'ObjectProxy.splice', evt
    proxy = @hasProxy(evt.path)
    if proxy
      proxy.emit 'splice', evt
  _callMove: (evt) =>
    console.log 'ObjectProxy.move', evt
    proxy = @hasProxy(evt.path) # this is the original evt.
    if proxy
      # get the new proxy => this would now be required.
      toProxy = @getProxy(evt.toPath)
      evt.toProxy = toProxy
      proxy.emit 'move', evt


# ObjectProxy
class ObjectProxy extends EventEmitter
  constructor: (@data) ->
    @map = new ProxyMap @
  _path: (path) ->
    path.split('.')
  _pathWithKey: (path) ->
    segs = @_path path
    key = segs.pop()
    [ segs, key ]
  get: (path) ->
    # split the path object...
    @_get @_path(path), @data
  getProxy: (path) ->
    @map.getProxy path
  hasProxy: (path) ->
    @map.hasProxy path
  _get: (segs, data) ->
    current = data
    for i in [0...segs.length]
      seg = segs[i]
      if current?.hasOwnProperty(seg)
        current = current[seg]
      else
        return undefined
    current
  set: (path, val) ->
    [ segs , key ] = @_pathWithKey path
    current = @_get segs, @data
    if current instanceof Object
      @_set path, current, key, val
    else # we cannot SET the key.
      throw new Error("ObjectProxy.set:not_an_object: #{path}")
  _set: (path, current, key, val) ->
    oldVal = current[key]
    current[key] = val
    @emit 'set', {type: 'set', path: path, oldVal: oldVal, newVal: val}
  splice: (path, index, removeCount, inserted) ->
    ary = @get path
    if not (ary instanceof Array)
      throw new Error("ObjectProxy.splice:not_an_array: #{path}")
    @_splice ary, path, index, removeCount, inserted
  _splice: (ary, path, index, removeCount, inserted) ->
    shiftStart = index + removeCount
    changed = []
    # for shifting
    # SHIFTING doesn't do anything by itself.
    # The receipient should SWAP out the path object.
    if shiftStart < ary.length
      shiftDiff = (index + inserted.length) - shiftStart
      if shiftDiff > 0
        for i in [(ary.length - 1)...(shiftStart - 1)] by -1
          changed.push
            type: 'move'
            path: "#{path}.#{i}"
            oldVal: ary[i]
            newVal: ary[i + shiftDiff]
            toPath: "#{path}.#{i + shiftDiff}"
      else if shiftDiff < 0
        for i in [shiftStart...ary.length]
          changed.push
            type: 'move'
            path: "#{path}.#{i}"
            oldVal: ary[i]
            newVal: ary[i + shiftDiff]
            toPath: "#{path}.#{i + shiftDiff}"

    # for removed & inserted - where they overlap they are collapsed to a single SET
    # so far this works for SHIFTING OUT (i.e. array got bigger)
    # if we want to SHIFT in... what does that mean?
    # it means the current object still exists... and we'll be in trouble
    # even when shifting out there is no guarantee that the object doesn't exist.
    # it might make more sense to just refresh the object instead of doing the binding.
    # (i.e. we might actually end up with a complete different object - that's the
    # goal anyways).
    # what happens when we have to SHIFT IN?
    # that's when we are actually deleting.
    removeUpTo = Math.min(shiftStart, ary.length)
    insertUpTo = index + inserted.length
    for i in [index...Math.max(removeUpTo, insertUpTo)]
      if i < removeUpTo and i < insertUpTo
        changed.push
          type: 'set'
          path: "#{path}.#{i}"
          oldVal: ary[i]
          newVal: inserted[i - index]
      else if i < removeUpTo
        changed.push
          type: 'delete'
          path: "#{path}.#{i}"
          oldVal: ary[i]
      else if i < insertUpTo
        changed.push
          type: 'set'
          path: "#{path}.#{i}"
          oldVal: undefined
          newVal: inserted[i - index]

    removed = ary.splice index, removeCount, inserted...
    for evt in changed
      @emit evt.type, evt
    @emit 'splice', {type: 'splice', path: path, index: index, removed: removed, inserted: inserted}
  push: (path, inserted, evt) ->
    if not (inserted instanceof Array)
      throw new Error("ObjectProxy.push:not_an_array")
    ary = @get path
    @_splice ary, path, ary.length, 0, inserted, evt
  pop: (path, evt) ->
    ary = @get path
    @_splice ary, path, ary.length - 1, 1, [], evt
  shift: (path, evt) ->
    @splice path, 0, 1, [], evt
  unshift: (path, inserted, evt) ->
    if not (inserted instanceof Array)
      throw new Error("ObjectProxy.unshift:not_an_array")
    @splice path, 0, 0, inserted, evt
  setAlias: (path, path2) ->
    @map.setAlias path, path2
    @getProxy path
  delete: (path) ->
    [ segs, key] = @_pathWithKey path
    parent = @_get segs, @data
    if parent instanceof Object
      @_delete path, parent, key
    else
      throw new Error("ObjectProxy.delete:not_an_object: #{path}")
  _delete: (path, parent, key) ->
    oldVal = parent[key]
    delete parent[key]
    @emit 'delete', {type: 'delete', path: path, oldVal: oldVal}

module.exports = ObjectProxy
