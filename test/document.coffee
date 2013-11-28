Parser = require '../src/covalent'
Document = require '../src/document'
Selector = Document.Selector
jQuery = require '../src/coquery'
Runtime = require '../src/runtime'

fs = require 'fs'
path = require 'path'

# to throttle a call...
# it basically does this...
# 1 - a function - as soon as it's called, it's protected by a *lock*...
throttleAsync = (func) ->
  status = {called: false}
  helper = () ->
    console.log 'throttleAsync.start', status
    func () ->
      status.called = false # this should be used with async...???
      console.log 'throttleAsync.end', status
  () ->
    if not status.called
      status.called = true # immediately stop it... (can it fire fast enough to disrupt this???).
      setTimeout(helper, 200) # how do we clear out the timeout afterwards? don't worry about this for now.
    else
      console.log 'callThrottled', status


Runtime.registerFunc 'power', Math.pow
Runtime.registerFunc 'abs', Math.abs
Runtime.registerFunc 'now', () -> new Date()

# in order to slow down the firing... we should do something the following...
# 1 - set the firing to be true (multiple of them will set it the same way).
# 2 - have an interval poll to retrieve the data call.
# 3 - only rebind after successfully retrieving the call
class AppNetLoader
  constructor: (@element, @runtime, @options = {}) ->
    @options.threshold ||= 0.8
    @options.maxLength ||= 50 # total number of items we want to have in the list.
    @options.interval ||= 1000
    @options.beforeKey ||= 'before_id'
    @options.sinceKey ||= 'since_id'
    @options.url ||= 'https://alpha-api.app.net/stream/0/posts/stream/global'
    @options.context ||= 'appNet'
    @options.idKey ||= 'id'
    @$ = @runtime.$
    @getLatestData () ->
    @refresh = throttleAsync @getLatestData
  # to have it the other way around - we'll need to have the data being auto-scrolled down (and prevent
  # the old data from being fired...).
  getLatestData: (cb) => # time to figure out how to get the next sets of data based on threshold...
    params =
      if @latestID
        obj = {}
        obj[@options.sinceKey] = @latestID
        obj
      else
        {}
    @$.getJSON @options.url, params, (data, status, xhr) =>
      console.log 'appNet.loader.getLatest', data
      itemList = data.data or [] #.reverse()
      console.log "*** get more data", params, itemList
      if itemList.length > 0
        @latestID = itemList[itemList.length - 1][@options.idKey]
        if @runtime.context.get(@options.context)
          @runtime.context.push(@options.context, itemList)
        else
          @runtime.context.set(@options.context, itemList)
          @oldestID = itemList[0][@options.idKey]
        if @runtime.context.get(@options.context).length > @options.maxLength
          console.log "*** pruning data"
          @runtime.context.splice(@options.context, 0, 20, []) # prune the prefix list...
          @oldestID = @runtime.context.get(@options.context)[0].id
      @$(@element).unbind 'scroll', @onScroll
      @$(@element).bind 'scroll', @onScroll
      cb()
  getOlderData: (cb) =>
    params =
      if @oldestID
        obj = {}
        obj[@options.beforeKey] = @oldestID
        obj
      else
        {}
    @$.getJSON @options.url, params, (data, status, xhr) =>
      itemList = data.data or [] #.reverse()
      console.log "*** get older data", params, itemList
      if itemList.length > 0
        @latestID = itemList[itemList.length - 1][@options.idKey]
        if @runtime.context.get(@options.context)
          @runtime.context.unshift(@options.context, itemList)
        else
          @runtime.context.set(@options.context, itemList)
        if @runtime.context.get(@options.context).length > @options.maxLength
          console.log "*** pruning data"
          @runtime.context.splice(@options.context, @runtime.context.get(@options.context).length - 20, 20, [])
      # prune the prefix list...
      @$(@element).unbind 'scroll', @onScroll
      @$(@element).bind 'scroll', @onScroll
      cb()
  destroy: () ->
    @$(@element).unbind 'scroll', @onScroll
    clearInterval @intervalID
  onScroll: (evt) =>
    scrollTop = @$(@element).scrollTop()
    scrollHeight = @$(@element)[0].scrollHeight
    height = @$(@element).height()
    if ((height + scrollTop) / scrollHeight) > @options.threshold
      @$(@element).unbind 'scroll', @onScroll
      @refresh()

Runtime.registerWidget 'appNet', AppNetLoader


html = null
parsed = null
document = null
$ = null
runtime = null
testData =
  accountHome:
    id: 'e1d4f651-024e-4067-addf-719104924f91'
    name: 'test'
    ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
  projects:
    [
      {
        id: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
        accountID: 'e1d4f651-024e-4067-addf-719104924f91'
        authors: ['e1d4f651-024e-4067-addf-719104924f91']
        description: 'Test New Project'
        files: []
        name: 'New Project'
        ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
        posts:
          '0298ae50-083e-450a-bc2d-4ea91ba3832e': 1
          '930adbda-af26-4a18-a76f-7c159c15cbd0': 1
          '9c8e8e61-0c03-476b-acb0-134fbee8ec19': 1
        references: []
        reviewers: []
        slug: 'new-project'
        toc: [
          {
            id: '0298ae50-083e-450a-bc2d-4ea91ba3832e'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            slug: 'objective'
            title: 'Objective'
            nested: []
          }
          {
            id: '930adbda-af26-4a18-a76f-7c159c15cbd0'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            title: 'test post'
            slug: 'test-post'
            nested: []
          }
          {
            id: '9c8e8e61-0c03-476b-acb0-134fbee8ec19'
            projectID: 'e6d174e9-3fda-4c8b-bf7d-0f936bbad868'
            title: '3rd Post'
            slug: '3rd-post'
            nested: []
          }
        ]
      }
    ]


describe 'document test', () ->
  it 'should parse html', (done) ->
    fs.readFile path.join(__dirname, '../example/test.html'), 'utf8', (err, data) ->
      if err
        done err
      else
        try
          html = data
          parsed = Parser.parse data
          done null
        catch e
          done e

  it 'should load document', (done) ->
    try
      document = new Document parsed, {}
      done null
    catch e
      done e

  it 'should use selector', (done) ->
    try
      selector = new Selector '[data-bind]'
      results = selector.run document
      #console.log '*****select:[data-bind]****'
      #for elt in results
        #console.log 'element', elt.tag, elt.data('bind')
      selector = new Selector 'body'
      results = selector.run document
      #console.log results
      done null
    catch e
      done e

  it 'should use coquery', (done) ->
    try
      $ = jQuery(document)
      console.log $('script[type="text/template"]').html()
      done null
    catch e
      done e

  it 'should load runtime', (done) ->
    try
      runtime = new Runtime $
      runtime.loadTemplates()
      runtime.context.set 'accountHome', testData.accountHome
      runtime.context.set 'foo', [
        {item: 'foo'}
        {item: 'bar'}
        {item: 'baz'}
        {item: 'baw'}
      ]
      runtime.context.set 'stars', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      runtime.context.set 'rating', 2
      runtime.context.set 'hightlight', 0
      runtime.initializeView document
      console.log document.html()
      done null
    catch e
      done e
