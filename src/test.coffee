
deepEqual = (o1, o2) ->
  left = (o1, o2) ->
    for key, val of o1
      if not o2.hasOwnProperty(key)
        return false
    true
  both = (o1, o2) ->
    for key, val of o1
      if not deepEqual(o1[key], o2[key])
        return false
    true
  if o1 == o2 # the same object.
    true
  else if o1 instanceof Object and o2 instanceof Object
    left(o1, o2) and left(o2, o1) and both(o1, o2)
  else
    false

forEach = (ary, iterator, callback) ->
  # we won't do the shift version anymore... we'll pass in an i.
  helper = (i, result) ->
    if i == ary.length
      callback null # no result.
    else
      val = ary[i]
      iterator val, (err, result) ->
        if err
          callback err
        else # don't really care about the previous result? possibly...
          helper i + 1, result
  helper 0, null


class ExpectEqual
  constructor: (@name, @lhs, @rhs, @negate) ->
    @pass = false
    @expected = true
  run: (cb) ->
    @actual = deepEqual @lhs, @rhs
    @pass = if @negate then not @actual else @actual
    cb()
  toString: () ->
    "expect(#{@name}: #{@lhs} #{if @negate then '!=' else '=='} #{@rhs}; actual: #{@actual}, pass: #{@pass})"

class Expect
  constructor: (@name, @code, @expected) ->
    @pass = false
  run: (cb) ->
    try
      @actual = @code()
      if @expected instanceof Function
        @pass = @expected @actual, @
      else
        @pass = deepEqual @expected, @actual
    catch e
      @actual = e
    cb()
  toString: () ->
    "expect(#{@name}: #{@code}; expected: #{@expected}, actual: #{@actual}, pass: #{@pass})"

class ExpectError
  constructor: (@name, @code, @expected) ->
    @pass = false
  run: (cb) ->
    try
      @actual = @code()
      @pass = false
    catch e
      @actual = e
      @pass = true
    cb()
  toString: () ->
    "expectError(#{@name}: #{@code}; expected: #{@expected}, actual: #{@actual}, pass: #{@pass})"

class ExpectAsync
  constructor: (@name, @code, @expected) ->
    @pass = false
  run: (cb) ->
    @code (err, actual) =>
      @actual = actual
      if err
        @actual = err
        @pass = false
      else if @expected instanceof Function
        @pass = @expected(@actual)
      else if deepEqual(@expected, @actual)
        @pass = true
      else
        @pass = false
      cb() # we do not pass error to the next guy... we just call it.
  toString: () ->
    "expectAsync(#{@name}: #{@code}; expected: #{@expected}, actual: #{@actual}, pass: #{@pass})"

class ExpectErrorAsync
  constructor: (@code, @expected, @msg) ->
    @pass = false
  run: (cb) ->
    @code (err, actual) => # if we want to forcibly return from this function via timeout...
      if err
        @actual = err
        @pass = true
      else
        @actual = actual
        @pass = false
      cb()
  toString: () ->
    "expectErrorAsync(#{@name}: #{@code}; expected: #{@expected}, actual: #{@actual}, pass: #{@pass})"

class TestSuite

  constructor: (@name) ->
    @cases = []
    @pass = false
  equal: (name, lhs, rhs) ->
    @cases.push new ExpectEqual(name, lhs, rhs)
  notEqual: (name, lhs, rhs) ->
    @cases.push new ExpectEqual(name, lhs, rhs, true)
  expect: (name, code, expect) ->
    @cases.push new Expect name, code, expect
  expectError: (name, code, expect) ->
    @cases.push new ExpectError name, code, expect
  expectAsync: (name, code, expected) ->
    @cases.push new ExpectAsync name, code, expected
  expectErrorAsync: (name, code, expected) ->
    @cases.push new ExpectErrorAsync name, code, expected
  makeSuite: (name) ->
    suite = new TestSuite(name)
    @cases.push suite
    suite
  run: (cb) -> # we should run things sequentially.
    cases = [].concat @cases
    helper = (testCase, next) ->
      testCase.run next
    forEach cases, helper, (err, res) =>
      @pass = true
      for testCase in @cases
        if not testCase.pass
          @pass = false
      cb()
  toString: () ->
    buffer = "testcase(#{@name} => pass: #{@pass}): \n"
    for testCase in @cases
      buffer += "  " + testCase.toString() + "\n"
    buffer

module.exports = TestSuite
