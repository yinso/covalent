ObjectProxy = require '../src/object'

testData =
  accountHome:
    id: 'e1d4f651-024e-4067-addf-719104924f91'
    name: 'test'
    ownerID: 'e1d4f651-024e-4067-addf-719104924f91'
  testAccount:
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


proxy = new ObjectProxy testData

describe 'proxy getter/setter', () ->

  it 'should get ok', () ->
    test.equal proxy.get('accountHome'), testData.accountHome

  it 'should set ok', () ->
    val =
      foo: 'bar'
      baz: [0, 1, 2, 3, 4]
    test.log 'before set'
    proxy.set 'foo', val
    test.log 'proxy.set foo'
    newVal = proxy.get('foo')
    test.log 'after proxy.get(foo)'
    test.equal newVal, val

  it 'should get proxy and fire SET OK', (done) ->
    p1 = proxy.getProxy 'accountHome.id'
    newVal = 'new-val'
    p1.once 'set', (evt) ->
      try
        test.equal evt.path, 'accountHome.id'
        test.equal evt.newVal, newVal
        test.equal p1.get('.'), newVal
        done null
      catch e
        done e
    proxy.set 'accountHome.id', newVal

  it 'should delete OK', (done) ->
    p1 = proxy.getProxy 'foo.foo'
    oldVal = p1.get('.')
    p1.once 'delete', (evt) ->
      try
        test.equal evt.path, 'foo.foo'
        test.equal evt.oldVal, oldVal
        done null
      catch e
        done e
    proxy.delete 'foo.foo'

  it 'should set and propagate down OK', (done) ->
    bar =
      foo: 'bar'
      baz: 'bah'
    p1 = proxy.getProxy 'bar.foo'
    p1.once 'set', (evt) ->
      try
        test.equal evt.path, 'bar.foo'
        test.equal evt.newVal, 'bar'
        done null
      catch e
        done e
    proxy.set 'bar', bar

  it 'should delete and propagate down OK', (done) ->
    p1 = proxy.getProxy 'bar.foo'
    p1.once 'delete', (evt) ->
      try
        test.equal evt.path, 'bar.foo'
        test.equal evt.oldVal, 'bar'
        done null
      catch e
        done e
    proxy.delete 'bar'

  it 'should set alias fine', (done) ->
    proxy.setAlias 'test', 'testAccount'
    p1 = proxy.getProxy 'testAccount.id'
    newVal = 'new-test-val'
    p1.once 'set', (evt) ->
      try
        test.equal evt.path, 'testAccount.id'
        test.equal evt.newVal, newVal
        done null
      catch e
        done e
    proxy.set 'test.id', newVal

  it 'should emit to alias too', (done) ->
    p1 = proxy.getProxy 'test.id'
    newVal = 'hello world'
    p1.once 'set', (evt) ->
      try
        test.equal evt.path, 'test.id'
        test.equal evt.newVal, newVal
        done null
      catch e
        done e
    proxy.set 'testAccount', {id: newVal, name: newVal}

  it 'should rebind to new alias', (done) ->
    proxy.setAlias 'test', 'accountHome'
    newVal = 'what is up'
    p1 = proxy.getProxy 'accountHome.id'
    p2 = proxy.getProxy 'testAccount.id'
    shouldNotBeCalled = (evt) ->
      done new Error("alias_rebind_should_not_be_called")
    p2.once 'set', shouldNotBeCalled
    p1.once 'set', (evt) ->
      try
        test.equal evt.path, 'accountHome.id'
        test.equal evt.newVal, newVal
        p2.removeListener 'set', shouldNotBeCalled
        done null
      catch e
        done e
    proxy.set 'test.id', newVal


