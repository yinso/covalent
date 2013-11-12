
TestSuite = require '../src/test'

module.exports = () ->

  testSuite = new TestSuite('This is a test suite')
  testSuite.equal 'test', 1, 1

  testSuite.expect 'test foo', (() -> {foo: 'bar'}), {foo: 'bar'}

  testSuite.expectAsync 'test bar', ((cb) -> cb null, {bar: 'baz'}), {bar: 'baz'}

  testSuite.expectError 'test error', (() -> throw {error: true})

  testSuite2 = testSuite.makeSuite('a new test suite')

  testSuite2.equal 'test again', 1, 1

  testSuite2.notEqual 'test 2 again', 1, 2

  testSuite2.expect 'test foo again', (() -> {foo: 'bar'}), {foo: 'bar'}

  testSuite2.expectAsync 'test bar again', ((cb) -> cb null, {bar: 'baz'}), {bar: 'baz'}

  testSuite2.expectError 'test error again', (() -> throw {error: true})

  testSuite.run () ->
    console.log 'testResult', testSuite.toString()

