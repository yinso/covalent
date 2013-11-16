
###
Route is inspired by ExpressJS routes.

/seg1/:param1/:param2/:param...??

If we specify optional parameter - the url might be shorter than the definition
(by numbers of optional parameters)


Segment matching rule.

literal ALWAYS match -> i.e. it always consumes some items.

required param also ALWAYS match -> i.e. it always consume some items as well.

Optional param DO NOT always match -> hence its priority comes after the items that should be matched AFTER it.

SPLAT matches only AFTER everything else have had a chance to match.

###

class RouteParameter
  constructor: (param) ->
    @name = param.substring(1)
    if @name.match /\?$/
      @optional = true
      @name.replace /\?$/, ''
    else
      @optional = false
    # there can only be a single splat
    if @name.match /\.\.\.$/
      @splat = true
      @name.replace /\.\.\.$/, ''
  compare: (param) ->
    if not @optional and param.optional
      return -1
    if @optional and not param.optional
      return 1
    if @name < param.name
      return -1
    else if @name > param.name
      return 1
    else
      return 0

class Route
  constructor: (@url) ->
    @makeRouteParams @url.split('/')
  makeRouteParams: (segments) ->
    @params = []
    @splat = undefined
    @optionalCount = 0
    names = {}
    for seg, i in segments
      if seg.match /^\:/
        param = new RouteParameter seg
        if names[param.name]
          throw new Error("duplicative_param_name: #{param.name}")
        else
          names[param.name] = param
        if @splat and param.splat
          throw new Error("multiple_splat_in_url: #{@url}")
        else if param.splat
          @splat = param
        else
          if param.optional
            @optionalCount += 1
          @params[i] = param
      else
        @params[i] = seg
    @requiredCount = @params.length - @optionalCount
  normalizeMatchParams: (length) ->
    # we'll need to ensure that the match follows the priority rules
    # literals always match
    # required param always match
    # optional params matches from left to right, only if literals & required have matched
    # splat params matches only after everything else have matched
    # this depends on the length.
    # basically - we'll need to figure out the diff between length and the required fields.
    # that number, will tell us how many optional parameters will come into play.

    # when there are more items than we have in our definition.
    if length > @params.length
      if @splat
        return @params
      else
        return false
    else if length == @params.length
      return @params
    else if length < @requiredCount
      return false
    else
      output = []
      i = 0
      # we should determine which ones to add together
      optionalCount = length - @requiredCount
      for seg in @params
        if typeof(seg) == 'string'
          output.push seg
        else if not seg.optional
          output.push seg
        else if i < optionalCount
          output.push seg
          i += 1
        else
          continue
      output
  match: (url) ->
    segments = url.split '/'
    normalized = @normalizeMatchParams segments.length
    if not (normalized instanceof Array)
      return false
    params = {}
    splat = []
    i = 0
    while i < normalized.length
      spec = normalized[i]
      seg = segments[i]
      if typeof(spec) == 'string'
        if seg == spec
          i++
          continue
        else
          return false
      else
        params[spec.name] = seg
        i++
    if @splat
      while i < segments.length
        splat.push segments[i]
        i++
      params[@splat.name] = splat.join '/'
    params
  paramType: (param) ->
    if typeof(param) == 'string'
      'string'
    else
      'param'
  compare: (route) ->
    result = @_compare route
    if result != 0
      return result
    # determine if one has a splat versus another one.
    if not @splat and route.splat
      return -1
    if @splat and not route.splat
      return 1
    return 0
  _compare: (route) ->
    # we'll take the params for comparison.
    #a.compare(b) => -1 => a < b; 0 => a = b; 1 => a > b
    if @params.length < route.params.length
      return -1
    if @params.length > route.params.length
      return 1
    # they are equal so we'll compare the items.
    for i in [0...@params.length]
      lhs = @params[i]
      rhs = route.params[i]
      lhsType = @paramType lhs
      rhsType = @paramType rhs
      if not lhsType == rhsType
        if lhsType == 'string' # literal is stronger binding.
          return -1
        else
          return 1
      else if lhsType == 'string'
        if lhs < rhs
          return -1
        else if lhs > rhs
          return 1
        else
          continue
      else # both equal param => we should sort them on the name?
        # and should we sort them on optional comparison?
        result = lhs.compare rhs
        if result == 0
          continue
        else
          return result

# we'll need to sort the routes based on the following criteria
# literal gets sorted before
class RouteTable
  constructor: () ->
    @routes = []
  add: (url, callback) ->
    @routes.push [ new Route(url), callback]
    @routes.sort (a, b) -> a[0].compare(b[0])
  matchID: (url) ->
    #console.log 'RouteTable.matchID', url
    for [ route, callback ], i in @routes
      params = route.match url
      #console.log 'RouteTable.matchID', url, params, route
      if params != false # it might be an empty object so we need to check for false
        return {url: url, params: params, id: i}
    throw new Error("unknown_route: #{url}")
  runID: ({url, params, id}, cb) ->
    route = @routes[id]
    if not route
      throw new Error("unknown_route: #{url}")
    [ route, callback ] = route
    cb null, params, callback
  match: (url, cb) ->
    for [ route, callback ] in @routes
      params = route.match url
      #console.log 'RouteTable.match', url, params, route
      if params != false # it might be an empty object so we need to check for false
        return cb null, params, callback # need to return here so we don't reach the default eror condition.
    cb new Error("unknown_route: #{url}")
  get: (url) ->
    for [ route, callback ] in @routes
      if route.url == url
        return route
    undefined

{EventEmitter} = require 'events'
kvs = require './kvs'
url = require 'url'

isRelative = (path) ->
  path.match /^[^\/]/

pathTo = (from, to) ->
  helper = (toPaths, fromPaths) ->
    if toPaths.length == 0 # we are done.
      fromPaths.reverse().join('/')
    else if toPaths[0] == '.' # just remove it.
      toPaths.shift()
      helper toPaths, fromPaths
    else if toPaths[0] == '..'
      if fromPaths.length < 2 # we are in trouble.
        throw new Error("path_resolve_past_root: from: #{from}, to: #{to}")
      else
        toPaths.shift()
        fromPaths.shift()
        helper toPaths, fromPaths
    else # just add the segment onto fromPaths
      fromPaths.unshift toPaths.shift()
      helper toPaths, fromPaths
  # split the path by /
  fromPaths = from.split('/').reverse()
  # now we'll take the to and then walk backwards...
  # the last item is the name of the object (can be empty if ends in /)
  fromPaths.shift()
  # .. means walk upward.
  # . means no change of the current position.
  toPaths = to.split '/'
  # we will walk the toPaths forward, while walking fromPaths backward.
  helper toPaths, fromPaths

class App
  constructor: (@runtime) ->
    @$ = @runtime.$ #
    @getRoutes = new RouteTable()
    @postRoutes = new RouteTable()
    @errorHandlers = {}
  initialize: () ->
    @setupAddressRoute()
    @setupAnchor()
  setupAddressRoute: () ->
    app = @
    @$.address?.change (evt) =>
      console.log 'Address.change', evt.value
      req = @findRoute 'get', evt.value
      app.runRoute req
    $ = @$
  setupAnchor: () ->
    $ = @$
    app = @
    document = @$('body')[0].ownerDocument
    console.log '@setupAnchor', document
    $(document).on 'click', 'a', (evt) ->
      evt.preventDefault()
      console.log 'App.a.clickMe', @host, location.host, @href, @href.match /^javascript/
      if @href == '' or @href.match /^javascript/
        console.log 'App.a.JS', @host, location.host, @href
        return false
      if @host == location.host
        normalizedURL = app.normalizeURL $(@).attr('href')
        $.address.value normalizedURL.pathname + normalizedURL.search
      else
        popup = window.open @href
      false
    $(document).on 'submit', 'form', (evt) ->
      evt.preventDefault()
      form = @
      console.log 'jquery.on form', form
      formTarget = $(form).attr('action')
      req = app.postRoutes.matchID formTarget
      req.method = 'post'
      req.form = form
      app.runRoute(req)
      false
  normalizeURL: (source) ->
    parsed = url.parse source
    if parsed.host != location.host
      parsed
    else
      # determine if it's relative.
      if isRelative(source)
        url.parse pathTo(location.hash.substring(1), source)
      else
        parsed
  get: (url, callback) ->
    @getRoutes.add url, callback
  post: (url, callback) ->
    @postRoutes.add url, callback
  # the way routing works in APP is as follows
  # 1 - trap the address change event
  # 2 - when the address change event occurs, call findRoute
  #     if success - write to /newRequest
  # 3 - runRoute will get triggered with the following condition
  #     1 = /INIT == true (so we have run through all the initialization routine)
  #     this should only changed once.
  #     2 = /newRequest != /currentRequest (so if they are the same we will end up doing nothing)
  #     runRoute will take newRequest and map to the callback, and run the callback.
  #     and finally will update /currentRequest to /newRequest (so they are all the same).
  findRoute: (method, url) ->
    method = (method or 'get').toLowerCase()
    req =
      if method == 'get'
        @getRoutes.matchID url
      else
        @postRoutes.matchID url
    req.method = method
    req
  runRoute: (req, cb) ->
    cb = (err, params, callback) =>
      if err
        cb err
      else
        callback req
    if req.method == 'get'
      @getRoutes.runID req, cb
    else # we should ALMOST never have POST if we do this right.
      @postRoutes.runID req, cb
  redirect: (url) ->
    console.log 'App.redirect', url
    @$.address.value url
  destroy: () ->
    @$ = null
  getJSON: (url, cb) ->
    if arguments.length == 3
      data = arguments[1] or {}
      cb = arguments[2]
    @$.ajax
      type: 'GET'
      url: url
      data: kvs.flatten(data) # hopefully it's not too complex
      dataType: 'json'
      error: @makeErrorHandler cb
      success: @makeSuccessHandler cb
  postJSON: (url, data, cb) ->
    dataString = JSON.stringify data
    @$.ajax
      type: 'POST'
      url: url
      dataType: 'json'
      contentType: 'application/json'
      data: dataString
      error: @makeErrorHandler cb
      success: @makeSuccessHandler cb
  makeErrorHandler: (cb) ->
    (xhr, status, err) =>
      error =
        try
          new Error(xhr.responseText)
        catch e
      console.error 'Request.error', err, error
      if @predefinedError(error)
        @predefinedError(error)
      else
        cb error, null
  setErrorHandler: (status, handler) ->
    if not @errorHandlers.hasOwnProperty(status)
      @errorHandlers[status] = handler
    else
      console.error "App.setErrorHandler", "duplicate_error_handler", status, handler
  predefinedError: (err) ->
    if typeof(err) instanceof Error
      @errorHandlers(err.status)
    else
      undefined
  makeSuccessHandler: (cb) ->
    (data, status, xhr) ->
      cb null, data
  submit: ({form, error, dataType, success}) ->
    console.log 'App.submit', form
    @$(form).ajaxSubmit error: error, dataType: dataType, success: success
  postForm: (form, cb) ->
    @submit
      form: form
      error: @makeErrorHandler cb
      dataType: 'json'
      success: @makeSuccessHandler cb

module.exports = App

