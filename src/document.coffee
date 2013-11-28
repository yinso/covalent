Parser = require './covalent'
{EventEmitter} = require 'events'
_ = require 'underscore'

class Document
  constructor: (elt) ->
    @documentElement =
      if elt instanceof Element
        elt.setOwnerDocument @
      else
        elt = @createElement elt
        elt.setOwnerDocument @
        elt
    @_data = {}
  data: (key, val) ->
    if arguments.length == 1
      res = @_data[key]
      if res
        res
      else
        undefined
    else
      @_data[key] = val
  createElement: ({element, attributes, children}, parent = null) ->
    #console.log 'createElement', element, attributes
    elt = @initialize element, attributes, children, parent
    if element == 'script' # we will flatten out the inner elements.
      html = elt.html()
      elt.empty()
      elt.append html
    elt
  initialize: (tag, attrs, children, parent) ->
    element = new Element tag, attrs, null, parent
    for child in children
      if typeof(child) == 'string'
        element.append child
      else
        childElement = @createElement child, element
        element.append childElement
    element.setOwnerDocument @
    element
  bind: (args...) ->
  on: (args...) ->
  unbind: (args...) ->
  clone: () ->
    new Document @documentElement.clone()
  html: (args...) ->
    @documentElement.html args...

# I've already have the selector parsed... actually the selector ought to be decently simple.
# it might as well just be a function

class Element extends EventEmitter
  constructor: (tag, attributes, @_parent, @ownerDocument) ->
    @tag = tag
    @attributes = attributes
    @_data = {}
    @_children = []
  clone: () -> # when we clone do we worry about the current parent?
    elt = @ownerDocument.createElement {element: @tag, attributes: _.extend({}, @attributes), children: []}
    for child in @_children
      if child instanceof Element
        elt.append child.clone()
      else
        elt.append child
    elt
  setOwnerDocument: (doc) ->
    if not (doc instanceof Document)
      throw new Error("element.setOwnerDocument_not_document: #{doc}")
    @ownerDocument = doc
    for child in @_children
      if child instanceof Element
        child.setOwnerDocument(doc)
  parent: () ->
    @_parent
  children: () ->
    _.filter @_children, (elt) -> elt instanceof Element
  removeChild: (element) ->
    @_children = _.without @_children, element
    element._parent = null
  detach: () ->
    if @_parent
      @_parent.removeChild @
  append: (elt, after) ->
    if elt instanceof Element
      elt.detach()
      elt._parent = @
    if after
      index = @_children.indexOf(after)
      @_children.splice(index, 0, elt)
    else
      @_children.push elt
  prepend: (elt, before) ->
    if elt instanceof Element
      elt.detach()
      elt._parent = @
    if before
      index = @_children.indexOf(before) - 1
      if index > -1
        @_children.splice index, 0, elt
      else
        @_children.unshift elt
    else
      @_children.unshift elt
  after: (elt) ->
    @_parent.append elt, @
  attr: (key, val) ->
    if arguments.length == 1
      if @attributes.hasOwnProperty(key)
        return @attributes[key]
      else
        undefined
    else
      @attributes[key] = val
  removeAttr: (key) ->
    delete @attributes[key]
  data: (key, val) ->
    if arguments.length == 1
      res = @attr("data-#{key}")
      if res
        res
      else
        @_data[key]
    else
      @_data[key] = val
  getClasses: () ->
    val = @attr('class')
    val.split(' ')
  setClasses: (classes) ->
    @attr('class', classes.join(' '))
  addClass: (key) ->
    classes = @getClasses()
    classes.push key
    @setClasses classes
  removeClass: (key) ->
    classes = @getClasses()
    @setClasses _.without classes, key
  html: (str) ->
    if arguments.length == 0
      results = []
      for child in @_children
        if typeof(child) == 'string'
          results.push child
        else
          results.push child.toString()
      results.join('')
    else # we are *setting* the value.
      elt = Parser.parse '<div>' + str + '</div>'
      @empty()
      # we should have ownerDocument to figure things out...
      for child in elt.children
        if typeof(child) == 'string'
          @append child
        else
          @append @ownerDocument.createElement child, @
  getCSS: () ->
    result = {}
    for keyval in @attr('style').split(/\s*;\s*/)
      [key, val] = keyvals.split(/\s*=\s*/)
      result[key] = val
    result
  setCSS: (keyvals) ->
    result = []
    for key, val of keyvals
      result.push = "#{key}=#{val}"
    @attr('style', result.join(";"))
  css: (key, val) ->
    if arguments.length == 0
      throw new Error(".css_expects_at_least_1_arg")
    else if arguments.length == 1
      if typeof(key) == 'string'
        result = @getCSS()
        result[key]
      else if key instanceof Object
        @setCSS key
      else
        throw new Error("unsupported_css_argument: #{key}")
    else
      keyvals = @getCSS()
      keyvals[key] = val
      @setCSS keyvals
  toString: (buffer = []) ->
    if @_children.length == 0
      buffer.push "<#{@tag} #{@attrsToString()} />"
    else
      buffer.push "<#{@tag} #{@attrsToString()}>"
      for child in @_children
        if typeof(child) == 'string'
          buffer.push child
        else
          buffer.push child.toString()
      buffer.push "</#{@tag}>"
    buffer.join('')
  eltHTML: () ->
    "<#{@tag} #{@attrsToString()} />"
  hasBinding: () ->
    @bindings != null
  attrsToString: () ->
    buffers =
      for key, val of @attributes
        "#{key} = #{@escape(val)}"
    buffers.join(' ')
  empty: () ->
    for child, i in @_children
      if child instanceof Element
        child.empty()
        child._parent = null
    @_children = []
  escape: (str) ->
    JSON.stringify(str.toString())
  bind: (args...) ->
  unbind: (args...) ->
  on: (args...) ->

Document.Element = Element

class Selector
  @parse: (stmt) ->
    new Selector stmt
  constructor: (stmt) ->
    {@select} = Parser.parse "#{stmt} { @text: '' }"
    @matchExp = @compile @select
  negate: () ->
    origMatchExp = @matchExp
    @matchExp = (element) ->
      not origMatchExp(element)
    @select.not = if @select.hasOwnProperty('not') then not @select.not else true
  run: (elt, includSelf = false) ->
    result = []
    @match elt, result, includSelf
    result
  match: (element, result, includeSelf = false) ->
    if element instanceof Document
      element = element.documentElement
    if includeSelf
      @matchOne element, result
    for child in element.children()
      @match child, result, true
  matchOne: (element, result) ->
    res = @matchExp element
    #console.log '@matchOne', @select, res, element.eltHTML(), @matchExp.toString()
    if res
      result.push element
      true
    else
      false
  compile: (selectExp) ->
    if selectExp instanceof Array # this is a group (it's an OR).
      @compileArray selectExp
    else
      @compileOne selectExp
  compileArray: (selectExp) ->
    matchExps =
      for inner in selectExp
        @compile inner
    (element) =>
      #console.log 'matchArray', element.tag
      for match in matchExps
        if match(element)
          return true
      return false
  compileOne: (exp) ->
    eltExp = @compileTag(exp.elt)
    idExp = @compileID(exp.id)
    classExp = @compileClass(exp.class)
    attrExp = @compileAttr(exp.attr)
    (element) -> # why didn't this run????
      #console.log 'matchOne', element.tag
      eltExp(element) and idExp(element) and classExp(element) and attrExp(element)
  compileTag: (tag) ->
    if tag == '*'
      (element) ->
        #console.log 'isAnyElement', element.tag, tag
        true
    else
      (element) ->
        #console.log 'isElement', element.tag, tag, element.tag == tag
        element.tag == tag
  compileID: (id) ->
    if id instanceof Array
      (element) ->
        _.contains id, element.attributes['id']
    else if typeof(id) == 'string'
      (element) ->
        element.attributes['id'] == id
    else
      (element) ->
        true
  compileClass: (classes) ->
    if classes instanceof Array
      classExps =
        for cls in classes
          @compileOneClass cls
      (element) ->
        for classExp in classExps
          if classExp(element)
            return true
        return false
    else if typeof(classes) == 'string'
      @compileOneClass classes
    else
      (element) ->
        true
  compileOneClass: (cls) ->
    (element) ->
      eltClasses = element.getClasses()
      _.contains eltClasses, cls
  compileAttr: (attrs) ->
    if attrs instanceof Array
      attrExps =
        for attr in attrs
          @compileOneAttr attr
      (element) ->
        for attrExp in attrExps
          if not attrExp(element)
            return false
        return true
    else if attrs instanceof Object
      @compileOneAttr attrs
    else
      (element) -> true
  compileOneAttr: ({attr, op, val}) ->
    # op can be one of the following: '=' / '~=' / '^=' / '$=' / '*=' / '|='
    valExp =
      if val
        if op == '=' # this is an equal comparison.
          (attr) -> attr == val
        else if op == '~='
          regex = new RegExp val
          (attr) -> attr.match regex
        else if op == '^='
          regex = new RegExp "^#{val}"
          (attr) -> attr.match regex
        else if op == "$="
          regex = new RegExp "#{val}$"
          (attr) -> attr.match regex
        else
          throw new Error("unsupported_attribute_selector: #{attr}#{op}#{val}")
      else
        (attr) -> true
    (element) ->
      if not element.attributes.hasOwnProperty(attr)
        return false
      valExp element.attributes[attr]

Document.Selector = Selector

module.exports = Document
