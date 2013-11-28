_ = require 'underscore'
{EventEmitter} = require 'events'
Document = require './document'
Element = Document.Element
Selector = Document.Selector
Parser = require './covalent'
http = require 'http'
https = require 'https'
url = require 'url'
kvs = require './kvs'
qs = require 'querystring'

# implements the jQuery interface needed by covalent to work on the server-side.
# ***selectors
# element -> passing in the element itself.
# document -> passing in the document object itself as well.
# '<html>...</html>' -> creating html elements...
# '[attr]'
# 'script[type=val]'
# ***functions
# .data(key)
# .data(key, val) # not flattening it automatically!
# .attr(key, val)
# .attr(key)
# .removeAttr
# .bind event, callback
# .bind keyup, key, callback
# .css <object>
# .addClass
# .removeClass
# .children()
# .html(txt)
# .appendTo
# .append
# .prepend
# .after

class CQuery
  constructor: (elements, @context) ->
    for elt, i in elements
      @[i] = elt
      @length = elements.length
  html: (htmlString) ->
    if arguments.length == 0
      if @length > 0
        @[0].html()
      else
        null
    else
      for elt, i in @
        elt.html htmlString
      @
  attr: (key, val) ->
    if arguments.length == 1
      if @length > 0
        return @[0].attr(key)
      else
        return null
    else
      for elt in @
        elt.attr(key, val)
      @
  bind: (args...) ->
    for elt, i in @
      elt.bind args...
    @
  unbind: (args...) ->
    for elt, i in @
      elt.unbind args...
    @
  css: (arg...) ->
    if arguments.length == 1
      if @length > 0
        return @[0].css arg[0]
      else
        return null
    else
      for elt, i in @
        elt.css arg...
      @
  addClass: (cls) ->
    for elt, i in @
      elt.addClass cls
    @
  removeClass: (cls) ->
    for elt, i in @
      elt.removeClass cls
    @
  children: () ->
    if @length == 0
      new CQuery [], @context
    else
      new CQuery @[0].children(), @context
  appendTo: (parent) ->
    for elt, i in @
      parent.append elt
    @
  detach: () -> # not sure what detach means... It means it's not deleted...
    for elt, i in @
      elt.detach()
    @
  removeAttr: (key) ->
    for elt, i in @
      elt.removeAttr(key)
    @
  empty: () ->
    for elt, i in @
      elt.empty()
    @
  on: () ->
    @
  filter: (selector) ->
    #console.log 'jQuery.filter', selector
    selector = new Selector selector
    result = []
    for elt, i in @
      if elt instanceof Document
        selector.matchOne elt.documentElement, result
      else
        selector.matchOne elt, result
    new CQuery result, @context
  add: (selector, context = @context) ->
    sel = new Selector selector
    results = sel.run context
    new CQuery @toArray().concat(results), @context
  toArray: () ->
    elt for elt in @
  has: (selector) ->
    if selector instanceof Element
      for elt in @
        if elt == selector
          return new CQuery [ elt ], @context
      return new CQuery [], @context
    else
      selector = new Selector selector
      result = []
      for elt in @
        selector.match elt, result
      return new CQuery result, @context
  data: (key, val) ->
    if arguments.length == 1
      if @length == 0
        null
      else
        @[0].data key
    else
      for elt, i in @
        elt.data key, val
  remove: () ->
    for elt, i in @
      elt.detach() # we should also remove the objects from the list???
    @
  clone: () ->
    elements =
      for elt, i in @
        elt.clone()
    new CQuery elements, @context
  not: (selector) ->
    if selector instanceof Array
      result = []
      for elt, i in @
        if not _.contains(selector, elt)
          result.push elt
      new CQuery result, @context
    else if typeof(selector) == 'string'
      sel = new Selector selector
      result = []
      for elt, i in @
        res = sel.matchOne elt, result
        #console.log '@jQuery.not', selector, elt.eltHTML(), res
        if not res
          result.push elt
      #console.log 'jQuery.not', result
      new CQuery result, @context
    else
      throw new Error("unsupported_not_selector: #{selector}")
  prepend: (element) ->
    # we'll have to clone the element.
    for elt, i in @
      if i == 0
        elt.prepend element
      else
        elt.prepend element.clone()
    @
  append: (element) ->
    for elt, i in @
      if i == 0
        elt.append element
      else
        elt.append element.clone()
    @
  after: (element) ->
    for elt, i in @
      elt.after element
    @
  val: (value) ->
    if arguments.length == 0
      if @length > 0
        @[0].val()
    else
      for elt, i in @
        elt.val(value)
      @
  index: () ->
    if @length == 0
      null
    else
      if not @[0]._parent
        0
      else
        # determine where the elt is in relation to the parent.
        @[0]._parent.children().indexOf(@[0])


statusCodeToError = (statusCode) ->
  if statusCode >= 500
    new Error("server_error: #{statusCode}")
  else if statusCode >= 400
    new Error("bad_request: #{statusCode}")
  else if statusCode >= 300
    null
  else if statusCode >= 200
    null
  else
    null

getJSON = (uri, data, cb) ->
  ###
  if arguments.length == 2
    cb = data
    data = {}
  try
    data = kvs.flatten data
    options = url.parse uri
    options.query = _.extend {}, options.query, data
    console.log 'getJSON', uri, options
    protocol =
      if options.protocol == 'https:'
        https
      else if options.protocol == 'http:'
        http
      else
        throw new Error("unsupported_protocol: #{uri}")
    req = protocol.request options, (res) ->
      output = []
      res.setEncoding 'utf8'
      res.on 'data', (chunk) ->
        console.log 'getJSON.response.chunk', chunk
        output.push chunk
      res.on 'end', () ->
        try
          obj = JSON.parse output.join('')
          console.log 'getJSON.response.end', obj
          cb obj, res.statusCode
        catch e
          cb e, 500
    req.on 'error', cb
  catch e
    cb e, 500
  ###

postJSON = (uri, data, cb) ->
  ###
  if arguments.length == 2
    cb = data
    data = {}
  try
    data = kvs.flatten data
    options = url.parse uri
    protocol =
      if options.protocol == 'https'
        https
      else if options.protocol == 'http'
        http
      else
        throw new Error("unsupported_protocol: #{uri}")
    req = protocol.request options, (res) ->
      output = []
      res.setEncoding 'utf8'
      res.on 'data', (chunk) ->
        output.push chunk
      res.on 'end', () ->
        try
          obj = JSON.parse output.join('')
          cb obj, res.statusCode
        catch e
          cb e, 500
    req.on 'error', cb
    query = qs.stringify(data)
    req.setHeader 'Content-Type', 'application/x-www-form-urlencoded'
    req.setHeader 'Content-Length', query.length
    req.write query
    req.end()
  catch e
    cb e, 500
  ###

query = (document) ->
  if typeof(document) == 'string'
    document = new Document document
  jQuery = (selector, context = document) ->
    if selector instanceof Element
      new CQuery [selector], document
    else if selector instanceof Document
      new CQuery [selector], document
    else if selector.match(/<[^>]+>/)
      elt = document.createElement Parser.parse('<div>'+ selector + '</div>')
      new CQuery elt.children(), document
    else
      selector = new Selector selector
      new CQuery selector.run(document, false), document
  jQuery.getJSON = getJSON
  jQuery

module.exports = query
