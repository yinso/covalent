
Parser = require './covalent'
BindingFactory = require './binding'
EachBinding = require './each'
WidgetFactory = require './widget'

###

  1 => 1
  1 + 1 => 1 + 1
  1 + (if 1 { 2 } else { 3 }) =>
  1 + (function() {
    if (1) {
      return 2;
    } else {
      return 3;
    }
  }).call(this)

  if 1 { 2 } else { 3 } =>
  (function() {
    if (1) {
      return 2;
    } else {
      return 3;
    }
  }).call(this)


  function(context, cb) {
    try
     result = (fillin here) tabLevel = 3
     cb null, result
    catch e
     cb e
  }




###


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

###

  Converting EXP to ANF (A-Normal Form)

  A-Normal Form, in a nutshell, names the implicit parameters, and sequence the expression in evaluation order.

  For example. Let's say that we have the following.

  1 + foo(abc, bar() + 1))

  Its A-Normal Form would be

  arg1 = bar()
  arg2 = arg1 + 1
  arg3 = foo(abc, arg2)
  arg4 = 1 + arg3
  return arg4

  A-Normal Form is a good intermediary representation between a syntax-tree to a CPS-equivalent. What it basically
  does is to flatten out the syntax tree into a syntax "stack". A-Normal Form similar  to
  SSA (Single-State Assignment)

  We mark the statements where we are generating a new binding with anf: <arg> so the CPS function knows we
  explicitly mark it.

  NOTE - An `if` statement has two branches, and both will generate different results. In our implementation we
  do not deal with having two subsequent branches for the ANF. Instead, such branching is done during the CPS step.

###
expToANF = (exp) ->

  symTable = {}

  gensym = (sym = "arg") ->
    if not symTable.hasOwnProperty(sym)
      symTable[sym] = 1
    {id: "#{sym}#{symTable[sym]++}"}

  anfOp = ({op, lhs, rhs}, stack) ->
    lhsRes = anfExp(lhs, stack)
    rhsRes = anfExp(rhs, stack)
    {op: op, lhs: lhsRes, rhs: rhsRes}

  anfFuncall = ({funcall, args}, stack) ->
    func = anfExp funcall, stack
    resArgs =
      for arg in args
        anfExp arg, stack
    err = gensym("err")
    res = gensym("res")
    stack.push {anf: res, err: err, funcall: func, args: resArgs}
    res

  anfIf = (exp, stack) ->
    resExp = {if: anfExp(exp.if, stack), then: anfInner(exp.then), else: anfInner(exp.else)}
    # how do we do object equal?
    if deepEqual(exp, resExp)
      exp
    else
      err = gensym("err")
      res = gensym("res")
      stack.push {anf: res, if: resExp.if, then: resExp.then, else: resExp.else, err: err}
      res

  anfBlock = ({block}, stack) ->
    for i in [0...block.length - 1]
      anfExp(block[i], stack)
    anfExp(block[block.length - 1], stack)

  anfObject = ({object}, stack) ->
    newKeyVals =
      for [key, val] in object
        res = anfExp val, stack
        [key, res]
    {object: newKeyVals}

  anfExp = (exp, stack = []) ->
    if not (exp instanceof Object)
      exp
    else if exp.block
      anfBlock exp, stack
    else if exp.op # operator...
      anfOp exp, stack
    else if exp.if
      anfIf exp, stack
    else if exp.funcall
      anfFuncall exp, stack
    else if exp.object
      anfObject exp, stack
    else
      exp

  anfInner = (exp) ->
    stack = []
    last = anfExp exp, stack
    stack.push last
    stack

  anfInner exp

###

  Convert from A-Normal Form to CPS

  This takes a syntax stack and convert it back into another syntax tree at the same time adding in the continuations.

  The approach is to unwind the stack, and then take the previous expression and the current expression to
  determine how to glue them together

  1) if the previous expression is a marked ANF expression, there are currently two possibilities.

    The previous exp is a funcall - in this case, we just create a continuation (i.e. callback) to wrap the current exp.

    The previous exp is an if statement - in this case, we'll have to wrap the current exp with continuation within
    both the then branch and the else branch of the if statement.

  2) if the previous expression isn't a marked ANF expression, then we'll prepend it to the current expression to
     create a block

###
anfToCPS = (stack) ->

  swapCpsID = (exp, from, to) ->
    if not (exp instanceof Object)
      exp
    else if exp.id
      if exp.id == from.id
        to
      else
        exp
    else if exp.op
      {op: exp.op, lhs: swapCpsID(exp.lhs, from, to), rhs: swapCpsID(exp.rhs, from, to)}
    else if exp.funcall
      {funcall: swapCpsID(exp.funcall, from, to), args: (swapCpsID(arg, from, to) for arg in exp.args)}
    else if exp.block
      {block: (swapCpsID(exp, from, to) for exp in exp.block)}
    else if exp.if
      {if: swapCpsID(exp.if, from, to), then: swapCpsID(exp.then, from, to), else: swapCpsID(exp.else, from, to)}
    else
      throw new Error("swapCpsID:unknown_exp: #{JSON.stringify(exp, null, 2)}")

  lastResFromBlock = (stack) ->
    # we'll walk backwards...
    for i in [stack.length - 1..0] by -1
      exp = stack[i]
      if exp.anf
        return exp.anf

  stackAddContinuation = (stack, cont, res) ->
    newStack = [].concat stack
    lastExp = newStack[newStack.length - 1]
    if lastExp?.id == res.id
      newStack.pop()
    newStack.push cont
    newStack

  blockAddContinuationThenCPS = (stack, cont, anfRes) ->
    stackAnf = lastResFromBlock(stack)
    newContinuation = swapCpsID cont, anfRes, stackAnf
    newStack = stackAddContinuation stack, newContinuation, stackAnf
    anfToCPS newStack

  cpsInner = (stack, i, resExp) ->
    if i < 0
      return resExp
    exp = stack[i]
    if not (exp instanceof Object)
      if resExp.block
        resExp.block.unshift exp
      else
        resExp = {block: [exp, resExp]}
      cpsInner stack, i - 1, resExp
    else if exp.anf
      err = exp.err
      if exp.funcall
        # we'll need to handle the callback...
        if resExp?.id == exp.anf.id # this is the simplified version.
          cpsInner stack, i - 1, {funcall: exp.funcall, args: exp.args.concat([{id: 'cb'}]), cps: true}
        else
          callback =
            function: ''
            args: [exp.err.id, exp.anf.id]
            body: [
              {
                if: err
                then: {funcall: {id: 'cb'}, args: [err]}
                else: if resExp.funcall then resExp else {funcall: {id: 'cb'}, args: [null, resExp]}
                cps: true
              }
            ]
          cpsInner stack, i - 1, {funcall: exp.funcall, args: exp.args.concat([callback]), cps: true}
      else if exp.if
        thenExp = blockAddContinuationThenCPS exp.then, resExp, exp.anf
        elseExp = blockAddContinuationThenCPS exp.else, resExp, exp.anf
        cpsInner stack, i - 1, {if: exp.if, then: thenExp, else: elseExp, cps: true}
      else
        throw new Error("unknown_anf_form: #{JSON.stringify(exp, null, 2)}")
    else # we should convert the res into a block if it isn't one.
      if resExp.block
        resExp.block.unshift exp
      else
        resExp = {block: [ exp, resExp ]}
      cpsInner stack, i - 1, resExp

  cps = (stack) ->
    cpsInner stack, stack.length - 2, stack[stack.length - 1]

  res = cps stack
  if not (res instanceof Object)
    {funcall: {id: 'cb'}, args: [null, res]}
  else if res.cps
    res
  else
    {funcall: {id: 'cb'}, args: [null, res]}

class LineBuffer
  constructor: (@level = 0) ->
    @tab = '  '
    @current = [ @level , '' ]
    @lines = [ @current ]
  incLevel: () -> # this is going to increase the level for the current line.
  decLevel: () ->
  write: (str) ->
    lines = str.split /(\r|\n|\r\n)/
    @append lines[0]
    for i in [1...lines.length]
      @newLine()
      @append lines[i]
  writeLine: (str) ->
    @write str
    @newLine()
  newLine: () ->
    @current = [ @level , '' ]
    @lines.push @current
  indent: () ->
    @level++
    @current[0] = @level
  dedent: () ->
    @level--
    @current[0] = @level
  append: (text) ->
    @current[1] += text
  toString: () ->
    (@toLine(line) for line in @lines).join("\n")
  toLine: ([level, line]) ->
    (@tab for i in [0...level]).join('') + line

# basic compiler works now... it's time to see how it can be integrated.
# NOTE - we still have the whole binding thing to work out as well...
# these are ready to go, but let's think through what we are supposed to do.
# let's see how I would be able to hook them up...
# I would want a particular binding created.
# we can even use compiler to compile the template!
class Compiler
  constructor: (@runtime) ->
  destroy: () ->
    delete @runtime
  parse: (stmt) ->
    Parser.parse stmt
  parseGen: (stmt) ->
    @generate(@parse(stmt))
  compile: (stmt) ->
    depends = {}
    exp = @parse(stmt)
    if exp.bindings
      @compileBindings exp
    else
      @compileExp exp
  compileBindings: (exp, bindingList = []) ->
    for binding, i in exp.bindings
      if binding.at # this is an at rule.
        @compileAtRuleBinding binding, bindingList
      else if binding.each # this is a EachBinding => it is doable when there is also a template binding
        @compileEachBinding binding, bindingList
      else
        throw new Error("binding_not_supported_yet: #{JSON.stringify(binding)}")
    bindingList
  compileEachBinding: ({each, template}, bindingList = []) ->
    binding = new EachBinding each, template, @runtime
    bindingList.push binding
  compileAtRuleBinding: ({at, bindings}, bindingList = []) ->
    for {prop, exp}, i in bindings
      depends = {}
      callback = @compileExp(exp, depends)
      bindingExp = BindingFactory.make(at, prop, depends, callback, @runtime)
      bindingList.push bindingExp
    # the AtRule signifies what to compile - time to create a registry.
  newEnvironment: (current, prev) ->
    newEnv = Object.create prev
    for key, val of current
      if current.hasOwnProperty(key)
        newEnv[key] = val
    newEnv
  compileExp: (exp, depends = {}) ->
    anf = @expToANF(exp)
    cps = @anfToCPS(anf)
    compiled = @cpsToSource(cps, depends)
    #console.log 'Compiler.compileExp', compiled
    new Function ['cb'], """
        var self = this;
        #{compiled}
    """
  expToANF: expToANF
  anfToCPS: anfToCPS
  cpsToSource: (exp, depends = {}) ->
    newEnv = @newEnvironment {cb: {id: 'cb'}}, @runtime.env
    @generate exp, newEnv, 3, depends
  generate: (exp, env, level, depends, isLast = false) ->
    buffer = new LineBuffer(level) # here's the thing... are we going to write this in a way that'll
    @gen exp, env, buffer, depends, isLast
    buffer.toString()
  gen: (exp, env, buffer, depends, isLast) ->
    # let's generate
    if not (exp instanceof Object)
      @genLiteral exp, env, buffer, depends, isLast
    else if exp.op
      @genOp exp, env, buffer, depends, isLast
    else if exp.funcall
      @genFuncall exp, env, buffer, depends, isLast
    else if exp.id
      @genID exp, env, buffer, depends, isLast
    else if exp.cell
      @genCell exp, env, buffer, depends, isLast
    else if exp.cellSet
      @genCellSet exp, env, buffer, depends, isLast
    else if exp.cellAlias
      @genCellAlias exp, env, buffer, depends, isLast
    else if exp.if
      @genIf exp, env, buffer, depends, isLast
    else if exp.element
      @genElement exp, env, buffer, depends, isLast
    else if exp.object
      @genObject exp, env, buffer, depends, isLast
    else if exp.hasOwnProperty('function')
      @genFunction exp, env, buffer, depends, isLast
    else
      throw new Error("Compiler.generate:unsupported_exp: #{JSON.stringify(exp)}")
  genLiteral: (exp, env, buffer, depends, isLast) ->
    if typeof(exp) != 'string'
      return buffer.append exp
    str = exp.replace(/"/g, "\\\"").replace(/\r/g, "\\r").replace(/\n/g, "\\n")
    buffer.append "\"#{str}\""
  genOp: ({op, lhs, rhs}, env, buffer, depends, isLast) ->
    if (op == '!')
      buffer.write '!'
      @gen lhs, env, buffer, depends, false
    else
      @gen lhs, env, buffer, depends, false
      buffer.write " #{op} "
      @gen rhs, env, buffer, depends, false
  genFuncall: ({funcall, args}, env, buffer, depends, isLast) ->
    @gen funcall, env, buffer, depends, false
    buffer.write ".call(self, "
    for arg, i in args
      @gen arg, env, buffer, depends, false
      if i != args.length - 1
        buffer.write ", "
    buffer.write ")"
  genFunction: (exp, env, buffer, depends, isLast) ->
    {args, body} = exp
    newArgs = {}
    for arg in args
      newArgs[arg] = {id: arg}
    newEnv = @newEnvironment newArgs, env
    buffer.write "function #{exp.function}("
    buffer.write args.join(", ")
    buffer.write ") {"
    buffer.newLine()
    buffer.indent()
    for i in [0...body.length - 1]
      @gen body[i], newEnv, buffer, depends, false
      buffer.write ";"
      buffer.newLine()
    lastExp = body[body.length - 1]
    if lastExp.if
      @gen lastExp, newEnv, buffer, depends, true
    else
      buffer.write "return "
      @gen lastExp, newEnv, buffer, depends, false
      buffer.write ";"
    buffer.newLine()
    buffer.dedent()
    buffer.write "}"
  genID: ({id}, env, buffer, depends, isLast) ->
    #if not @runtime.env.hasOwnProperty(id)
    #  throw new Error("Compiler.compile:unknown_id: #{id}")
    if env.hasOwnProperty(id)
      buffer.write id
    else if @runtime.env.hasOwnProperty(id)
      buffer.write "self.runtime.env['"
      buffer.write id
      buffer.write "']"
    else if env[id]
      buffer.write id
    else
      throw new Error("Compiler.compile:unknown_id: #{id}")
  genCell: ({cell}, env, buffer, depends, isLast) ->
    depends[cell] = cell
    buffer.write "self.context.get(\"#{cell}\")"
  genCellSet: ({cellSet, exp}, env, buffer, depends, isLast) ->
    buffer.write "self.context.set(\"#{cellSet}\", "
    @gen exp, env, buffer, depends
    buffer.write ")"
  genCellAlias: ({cellAlias, exp}, env, buffer, depends, isLast) ->
    depends[exp] = exp
    buffer.write "self.context.setAlias(\"#{cellAlias}\", \"#{exp}\")"
  genIf: (exp, env, buffer, depends, isLast) ->
    if not exp.cps
      buffer.writeLine "(function() {"
      buffer.indent()
    buffer.write "if ("
    @gen exp.if, env, buffer, depends, false
    buffer.writeLine ") {"
    buffer.indent()
    if (not exp.cps) or isLast
      buffer.write "return "
    @gen exp.then, env, buffer, depends, false
    buffer.newLine()
    buffer.dedent()
    buffer.writeLine "} else {"
    buffer.indent()
    if not (exp.cps) or isLast
      buffer.write "return "
    @gen exp.else, env, buffer, depends, false
    buffer.newLine()
    buffer.dedent()
    buffer.writeLine "}"
    if not exp.cps
      buffer.dedent()
      buffer.writeLine "}).call(this)"
  genElement: ({element, prop}, env, buffer, depends, isLast) ->
    buffer.write("self.runtime.$(")
    buffer.write "self.element"
    buffer.write ")"
    buffer.write switch prop
      when "value" then ".val()"
      when "html" then ".html()"
      when "text" then ".text()"
      when "height" then ".height()"
      when "width" then ".width()"
      when "relLeft" then ".position().left"
      when "relTop" then ".position().top"
      when "pos" then ".position()"
      when "absLeft" then ".offset().left"
      when "absTop" then ".offset().top"
      when "offset" then ".offset()"
      when "index" then ".index()"
      when "scrollTop" then "[0].scrollTop"
      when "scrollHeight" then ".scrollHeight()"
      else throw new Error("Compiler.compile:unknown_element_property: #{prop}")

  genObject: ({object}, env, buffer, depends, isLast) ->
    buffer.writeLine("{")
    buffer.indent()
    for [ key, exp ], i in object
      if i > 0
        buffer.write ", "
      buffer.write "#{key}: "
      #buffer.indent()
      @gen exp, env, buffer, depends
      buffer.newLine()
      #buffer.dedent()
    buffer.dedent()
    buffer.write "}"

module.exports = Compiler
