
Parser = require './covalent'
BindingFactory = require './binding'
EachBinding = require './each'

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
  compileExp: (exp, depends = {}) ->
    compiled = @generate(exp, 3, depends)
    new Function ['context', 'event', 'cb'], """try {
        var res = #{compiled};
        return cb(null, event, res);
      } catch (e) {
        return cb(e, event, runtime);
      }
    """
  generate: (exp, level = 0, depends) ->
    buffer = new LineBuffer(level) # here's the thing... are we going to write this in a way that'll
    @gen exp, buffer, depends
    buffer.toString()
  gen: (exp, buffer, depends) ->
    # let's generate
    if not (exp instanceof Object)
      buffer.append exp
    else if exp.op
      @genOp exp, buffer, depends
    else if exp.funcall
      @genFuncall exp, buffer, depends
    else if exp.id
      @genID exp, buffer, depends
    else if exp.cell
      @genCell exp, buffer, depends
    else if exp.cellSet
      @genCellSet exp, buffer, depends
    else if exp.cellAlias
      @genCellAlias exp, buffer, depends
    else if exp.if
      @genIf exp, buffer, depends
    else if exp.element
      @genElement exp, buffer, depends
    else if exp.object
      @genObject exp, buffer, depends
  genOp: ({op, lhs, rhs}, buffer, depends) ->
    if (op == '!')
      buffer.write '!'
      @gen lhs, buffer, depends
    else
      @gen lhs, buffer, depends
      buffer.write " #{op} "
      @gen rhs, buffer, depends
  genFuncall: ({funcall, args}, buffer, depends) ->
    @gen funcall, buffer, depends
    buffer.write "("
    for arg, i in args
      @gen arg, buffer, depends
      if i != args.length - 1
        buffer.write ", "
    buffer.write ")"
  genID: ({id}, buffer, depends) ->
    buffer.write id
  genCell: ({cell}, buffer, depends) ->
    depends[cell] = cell
    buffer.write "context.get(\"#{cell}\")"
  genCellSet: ({cellSet, exp}, buffer, depends) ->
    buffer.write "context.set(\"#{cellSet}\", "
    @gen exp, buffer, depends
    buffer.write ")"
  genCellAlias: ({cellAlias, exp}, buffer, depends) ->
    depends[exp] = exp
    buffer.write "context.setAlias(\"#{cellAlias}\", \"#{exp}\")"
  genIf: (exp, buffer, depends) ->
    buffer.writeLine "(function() {"
    buffer.indent()
    buffer.write "if ("
    @gen exp.if, buffer, depends
    buffer.writeLine ") {"
    buffer.indent()
    buffer.write "return "
    @gen exp.then, buffer, depends
    buffer.newLine()
    buffer.dedent()
    buffer.writeLine "} else {"
    buffer.indent()
    buffer.write "return "
    @gen exp.else, buffer, depends
    buffer.newLine()
    buffer.dedent()
    buffer.writeLine "}"
    buffer.dedent()
    buffer.writeLine "}).call(this)"
  genElement: ({element, prop}, buffer, depends) ->
    # this is appearing on RHS (i.e. getting the values)
    buffer.write("this.runtime.$(")
    buffer.write "this.element"
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
      else throw new Error("Compiler.compile:unknown_element_property: #{prop}")

  genObject: ({object}, buffer, depends) ->
    buffer.writeLine("{")
    buffer.indent()
    for [ key, exp ], i in object
      if i > 0
        buffer.write ", "
      buffer.write "#{key}: "
      #buffer.indent()
      @gen exp, buffer, depends
      buffer.newLine()
      #buffer.dedent()
    buffer.dedent()
    buffer.write "}"

module.exports = Compiler
