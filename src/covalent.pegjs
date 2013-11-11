/**********************************************************************

Covalent grammar.

Number
------

1
1.5

String
------

"this is a string"
'this is a string'

Object
------

{foo: 1, bar: "hello", baz: {nested: true}}


Identifier
----------

thisIsAnIdentifier


Reference (referring to proxy value)
---------

$this.is.a.reference

$use.number.for.array.index.1


Element
-------

this.val ==> $(@element).val()

this.html => $(@element).html()

this.<attr> => $(@element).attr('attr')

The above can appear on both LHS or RHS







**********************************************************************/

/**********************************************************************
Preamble
**********************************************************************/
{

function leftAssociative (lhs, rest) {
  if (rest.length == 0) {
    return lhs;
  }
  // if we are going to rewrite the whole thing... do we want to do the same as before??
  // or actually return the operator?
  // let's give it a shot.
  var i = 0;
  var result = lhs;
  console.log('leftAssociative', JSON.stringify(lhs), JSON.stringify(rest));
  for (i = 0; i < rest.length; ++i) {
     var next = rest[i];
     result = {op: next.op, lhs: result, rhs: next.rhs};
     console.log('leftAssociative', i, JSON.stringify(result));
  }
  return result;
}

function makeString(head, rest) {
  return [head].concat(rest).join('');
}

function normalizeHelper(elt, key, mod) {
  if (elt[key]) {
    if (elt[key] instanceof Array) {
      elt[key].push(mod);
    } else {
      elt[key] = [ elt[key], mod ];
    }
  } else {
    elt[key] = mod;
  }
}

function normalizeSelector(elt, rest) {
  for (var i = 0; i < rest.length; ++i) {
    var mod = rest[i];
    //console.log('normalizeSelector', elt, mod);
    if (mod.class) {
      normalizeHelper(elt, 'class', mod);
    } else if (mod.id) {
      normalizeHelper(elt, 'id', mod);
    } else if (mod.attr) {
      normalizeHelper(elt, 'attr', mod);
    } else if (mod.pseudo) {
      normalizeHelper(elt, 'pseudo', mod);
    }
  }
  return elt;
} 

function normalizeSelectorRelation(elt, rel, relElt) {
  elt[rel] = relElt;
  return elt;
}

function keyvalsToObject (keyvals) {
  var result = {};
  for (var i in keyvals) {
    result[keyvals[i][0]] = keyvals[i][1];
  }
  return result;
}

var depthCount = 0; 
var maxDepthCount = 200;

}

/**********************************************************************
START
**********************************************************************/

START
  = _ head:Statement rest:Statement*_ { 
    if (rest.length == 0) {
      return head; 
    } else {
      return [ head ].concat(rest);
    }
  }

/**********************************************************************
Statement
**********************************************************************/
Statement
  = exp:FunctionDeclaration _ { return exp; }
  / exp:InitBlockExpression _ { return exp; }
  / exp:BindingExpression _ { return exp; }
  / exp:Expression _ { return exp; }
  / exp:TopLevelBindingBlockExpression _ { return exp; }
  / exp:XHTMLExpression _ { return exp; }

/**********************************************************************
Expression
**********************************************************************/
Expression
  = exp:FunctionDeclaration _ { return exp; }
  / exp:BlockExpression _ { return exp; } 
  / exp:IfExpression _ { return exp; }
  / exp:TryCatchExpression _ { return exp; }
  / exp:ThrowExpression _ { return exp; }
  / exp:AssignmentExpression _ { return exp; }
  / exp:OrExpression _ { return exp; }
  / exp:FuncallExpression _ { return exp; }

NotExpression
  = '!' _ exp:Expression _ { return { op: '!', lhs: exp }; }

ParenedExpression
  = '(' _ exp:Expression _ ')' _ { return exp; }

MultiplyExpression
  = lhs:AtomicExpression _ rest:_tailMultiplyExp* { return leftAssociative(lhs, rest); }

_tailMultiplyExp
  = op:('*' / '/' / '%') _ rhs:AtomicExpression { return {op: op, rhs: rhs}; }

AddExpression
  = lhs:MultiplyExpression _ rest:_tailAddExp* { return leftAssociative(lhs, rest); }

_tailAddExp
  = op:('+' / '-') _ rhs:MultiplyExpression { return {op: op, rhs: rhs}; }
  
CompareExpression
  = lhs:AddExpression _ rest:_tailCompareExp* { return leftAssociative(lhs, rest); }

_tailCompareExp
  = op:('<=' / '<' / '>=' / '>' / '==' / '!=') _ rhs:AddExpression { return {op: op, rhs: rhs}; }

AndExpression
  = lhs:CompareExpression _ rest:_tailAndExp* { return leftAssociative(lhs, rest); }

_tailAndExp
  = op:'&&' _ rhs:CompareExpression { return {op: op, rhs: rhs}; }

OrExpression
  = lhs:AndExpression _ rest:_tailOrExp* { return leftAssociative(lhs, rest); }

_tailOrExp
  = op:'||' _ rhs:AndExpression { return {op: op, rhs: rhs}; }

AssignmentExpression
  //= lhs:Reference _ op:'=' _ exp:Reference _ ';'? _ { 
  //  return {cellAlias: lhs, exp: exp};
  //}
  // / lhs:Reference _ op:'=' _ exp:_blockExp _ { 
  = lhs:Reference _ op:'=' _ exp:_blockExp _ { 
    if (exp.cell) {
      return {cellAlias: lhs.cell, exp: exp.cell};
    } else {
      return {cellSet: lhs.cell, exp: exp };
    }
  }

BlockExpression
  = '{' _ head:_blockExp _ rest:_tailBlockExp* _ '}' _ { 
    if (rest.length == 0) {
       return head;
    } else {
      return {block: [ head ].concat(rest)}; 
    }
  }

_blockExp
  = exp:Expression _ ';'? _ { return exp; }

_tailBlockExp
  = _ exp:_blockExp _ { return exp; }

IfExpression
  = 'if' _ cond:OrExpression _ lhs:BlockExpression _ 'else' _ rhs:BlockExpression {
    return {if: cond, then: lhs, else: rhs};
  }
  / 'if' _ cond:OrExpression _ lhs:BlockExpression {
    return {if: cond, then: lhs};
  }

TryCatchExpression
  = 'try' _ tryExp:BlockExpression _ 
    'catch' _ '(' _ id:Identifier _ ')' _ catchExp:BlockExpression _ 
    'finally' _ finallyExp:BlockExpression _ 
  {
    return {try: tryExp, 
           catch: {function: null, args: [{name: id}], body: catchExp}, 
           finally: finallyExp};
  }
  / 'try' _ tryExp:BlockExpression _ 
    'catch' _ id:_catchErrorExpression _ catchExp:BlockExpression _ 
  {
    return {try: tryExp, catch: {function: null, args: [{name: id}], body: catchExp}};
  }

_catchErrorExpression
  = '(' _ id:Identifier _ ')' _ { return id; }
  / Identifier

ThrowExpression
  = 'throw' _ exp:Expression _ {
    return {throw: exp};
  }

FunctionDeclaration
  = 'function' _ name:Identifier _ '(' _ ')' _ exp:BlockExpression _ {
    return { function: name, args: [], body: exp }; 
  }
  / 'function' _ name:Identifier _ '(' _ args:_functionParamsExp _ ')' _ exp:BlockExpression _
  {
    return { function: name, args: args, body: exp }; 
  }

_functionParamsExp
  = lhs:_functionParamExp _ rest:_tailFunctionParamExp* { return [ lhs ].concat(rest); }

_functionParamExp
  = id:Identifier { return {name: id}; }

_tailFunctionParamExp
  = ',' _ param:_functionParamExp _ { return param; }

FuncallExpression
  = id:Identifier _ '(' _ ')' _  { return { funcall: {id: id}, args: []}; }
  / id:Identifier _ '(' _ args:_funcallParamsExp _ ')' _  {
    return { funcall: {id: id}, args: args }; 
  }

_funcallParamsExp
  = lhs:OrExpression _ rest:_tailFuncallParamExp* { return [ lhs ].concat(rest); }

_tailFuncallParamExp
  = ',' _ rhs:OrExpression _ { return rhs; }

/**********************************************************************
INIT Block Expression
**********************************************************************/
InitBlockExpression
  = '@init' _ ':'? _ exp:BlockExpression _ { 
    return {init: exp};
  } 

/**********************************************************************
Binding Expression
**********************************************************************/
BindingExpression
  = select:SelectorExpression _ exp:BindingBlockExpression _ {
    return {select: select, bindings: exp};
  }

BindingBlockExpression
  = '{' _ head:_bindingBlockExp _ rest:_tailBindingBlockExp* _ '}' _ { 
    return [ head ].concat(rest); 
  }

TopLevelBindingBlockExpression
  = bindings:BindingBlockExpression _ { return { bindings: bindings }; }
  / bindings:NakedBindingBlockExpression _ { return bindings; }

NakedBindingBlockExpression
  = head:_bindingBlockExp _ rest:_tailBindingBlockExp* _ {
    return {bindings: [ head ].concat(rest) };
  }

_bindingBlockExp
  = exp:EachBlockExpression _ ';'? _ { return exp; }
  / exp:WithBlockExpression _ ';'? _ { return exp; }
  / exp:TemplateBlockExpression _ ';'? _ { return exp; }
  / exp:TextBlockExpression _ ';'? _ { return exp; }
  / exp:AtRulesBlockExpression _ ';'? _ { return exp; }
  / exp:PropertyBindingExpression _ ';'? _ { return exp; }
  / exp:Expression _ ';'? _ { return exp; }
  
_tailBindingBlockExp
  = _ exp:_bindingBlockExp _ { return exp; }

EachBlockExpression
  = '@each' _ ':'? _ id:Reference _ ',' _ name:String _ ';'? { return { each : id.cell , template: name }; }

WithBlockExpression
  = '@with' _ ':'? _ id:Reference _ { return { with: id.cell }; }

TextBlockExpression
  = '@text' _ ':'? _ exp:Expression _ { return { at: 'text', bindings: [ {exp: exp} ] }; }

TemplateBlockExpression
  = '@template' _ ':'? _ exp:String _ { return { template: exp }; }

AtRulesBlockExpression
  = '@' id:Identifier _ ':'? _ '{' _ head:_atRulesBlockExp _ rest:_tailAtRulesBlockExp* _ '}' _ { 
    return {at: id, bindings: [ head ].concat(rest)}; 
  }

_atRulesBlockExp
  = exp:PropertyBindingExpression _ ';'? _ { return exp; }
  / exp:Expression _ ';'? _ { return exp; }
  
_tailAtRulesBlockExp
  = _ exp:_atRulesBlockExp _ { return exp; }

PropertyBindingExpression
  = id:Identifier _ ':' _ exp:Expression { return {prop: id, exp: exp}; }
  / id:String _ ':' _ exp.Expression { return {prop: id, exp: exp}; }


/**********************************************************************
CSS Selector

http://www.w3.org/TR/css3-selectors/

**********************************************************************/

SelectorExpression
  = GroupSelectorExp
  / CompoundSelectorExp

CompoundSelectorExp
  = DescendentSelectorExp
  / ChildSelectorExp
  / ImmediatePrecedeSelectorExp
  / PrecedeSelectorExp
  / SingleSelectorExp
  / AttributeSelectorExp

SingleSelectorExp
  = elt:ElementSelectorExp mods:SelectorModifierExp* {
    return normalizeSelector(elt, mods); 
  }

ElementSelectorExp
  = elt:Identifier { return {elt: elt}; }
  / '*' { return {elt: '*'}; }
  / exp:ClassSelectorExp { return normalizeSelector({elt: '*'}, [ exp ]); }
  / exp:IDSelectorExp { return normalizeSelector({elt: '*'}, [ exp ]); }
  / exp:AttributeSelectorExp { return normalizeSelector({elt: '*'}, [ exp ]); }

SelectorModifierExp
  = ClassSelectorExp
  / IDSelectorExp
  / AttributeSelectorExp
  / PseudoElementSelectorExp

ClassSelectorExp
  = '.' cls:Identifier { return {class: cls}; }

IDSelectorExp
  = '#' id:Identifier { return {id: id}; }

AttributeSelectorExp
  = '[' _ attr:Identifier _ ']' _ { return { attr: attr }; }
  / '[' _ attr:Identifier _ op:('=' / '~=' / '^=' / '$=' / '*=' / '|=') _ val:Literal _ ']' _
  { 
    return { attr: attr, op: op, arg: val};
  }

PseudoElementSelectorExp
  = ':' name:Identifier '(' arg:Literal ')' { 
    return { pseudo: name, args: [ arg ] };
  }
  / ':' name:Identifier { 
    return { pseudo: name };
  }

DescendentSelectorExp
  = ancestor:SingleSelectorExp _ descendent:SingleSelectorExp { 
    return normalizeSelectorRelation(descendent, 'ancestor', ancestor);
  }

ChildSelectorExp
  = parent:SingleSelectorExp _ '>' _ child:SingleSelectorExp {
    return normalizeSelectorRelation(child, 'parent', parent);
  }

ImmediatePrecedeSelectorExp
  = precede:SingleSelectorExp _ '+' _ recede:SingleSelectorExp {
    return normalizeSelectorRelation(recede, 'immediatePrecede', precede);
  }
  
PrecedeSelectorExp
  = precede:SingleSelectorExp _ '~' _ recede:SingleSelectorExp {
    return normalizeSelectorRelation(recede, 'precede', precede);
  }

GroupSelectorExp
  = head:CompoundSelectorExp _ rest:_tailGroupSelectorExp { return [ head ].concat(rest); }

_tailGroupSelectorExp
  = ',' _ exp:CompoundSelectorExp { return exp; }

/**********************************************************************
Atomic Expression

literals (string, number, boolean, null), references, etc. 

**********************************************************************/
AtomicExpression
  = ParenedExpression
  / NotExpression 
  / lit:Literal _ { return lit; }
  / func:FuncallExpression _ { return func; }
  / ThisElement
  / ref:Reference _ { return ref; }
  / obj:ObjectExpression _ { return obj; }

ObjectExpression
  = '{' _ keyvals:objKeyValPairExp* _ '}' _ { return {object: keyvals}; }

objKeyValPairExp
  = key:objKeyExp _ ':' _ val:objValExp _ ','? _ { return [ key, val ]; }

objKeyExp
  = str:String _ { return str; }
  / id:Identifier _ { return id; }

objValExp
  = exp:Expression _ { return exp; }

ThisElement
  = 'this' _ '.' _ prop:Identifier _ { return { element: 'this', prop: prop } ; }
  / 'this' { return { element: 'this' }; }

Reference
  = '$' path:ReferencePath { return { cell: path }; }
  / id:Identifier { return {id: id}; }

ReferencePath
  = head:ReferencePathHead rest:ReferencePathRest* { return makeString(head, rest); }
  / '.' { return '.'; }

ReferencePathHead
  = Identifier
  / Number

ReferencePathRest
  = '.' id:ReferencePathHead { return '.' + id; }

Identifier
  = !Keywords head:idChar1 rest:idChar* { return makeString(head, rest); }

idChar1
  = [a-z]
  / [A-Z]

idChar
  = [a-z]
  / [A-Z]
  / '-'
  / [0-9]

Keywords
  = 'if'
  / 'else'
  / 'try'
  / 'catch'
  / 'throw'
  / 'finally'
  / 'function'


Literal
  = String
  / Number
  / 'true' { return true; }
  / 'false' { return false; }
  / 'null' { return null; }

/**********************************************************************
XHTML
**********************************************************************/
XHTMLExpression
  = elt:SingleElementExp __ { return elt; }
  / start:OpenElementExp children:ChildXHTMLExpression* close:CloseElementExp {
    if (start.tag == close.tag) {
      return { element: start.tag, attributes: start.attributes, children: children };
    } else {
      throw new Error("invalid_xhtml_open_close_tag_unequal: " + start.tag);
    }
  } 

OpenElementExp
  = tag:StartElementExp __ attributes:AttributeExp* __ '>' {
    return { tag: tag, attributes: keyvalsToObject(attributes) };
  }

CloseElementExp
  = '</' __ name:Identifier __ '>' { 
    return {tag: name}; 
  }

SingleElementExp
  = tag:StartElementExp __ attributes:AttributeExp* __ '/' __ '>' {
    return { tag: tag, attributes: keyvalsToObject(attributes), children: [] };
  }

StartElementExp
  = '<' name:Identifier { 
    return name; 
  }

AttributeExp
  = name:Identifier __ '=' __ value:String __ {
    return [name, value]; 
  }

ChildXHTMLExpression
  = XHTMLExpression
  / XHTMLContentExpression
 
XHTMLContentExpression
  = chars:XHTMLContentChar+ { 
    return chars.join(''); 
  }

XHTMLContentChar
  = XHTMLComment { return ''; }
  / char:(!StartElementExp !CloseElementExp .) { 
    return char[2]; 
  }

__ 
  = (XHTMLComment / whitespace)*

XHTMLComment
  = '<!--' chars:XHTMLCommentChar* XHTMLCommentClose { 
    return { comment: chars.join('') }; 
  }

XHTMLCommentClose
  = '-->'

XHTMLCommentChar
  = char:(!XHTMLCommentClose .) { 
    return char[1]; 
  }

/**********************************************************************
Lexical Elements
**********************************************************************/

String
  = '"' chars:chars '"' _ { return chars; }
  / "'" chars:chars "'" _ { return chars; }

chars
  = chars:char* { return chars.join(""); }

char
  // In the original JSON grammar: "any-Unicode-character-except-"-or-\-or-control-character"
  = [^"'\\\0-\x1F\x7f]
  / '\\"'  { return '"';  }
  / "\\'"  { return "'"; }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / whitespace 
  / "\\u" digits:hexDigit4 {
      return String.fromCharCode(parseInt("0x" + digits));
    }

hexDigit4
  = h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit { return h1+h2+h3+h4; }

Number
  = int:int frac:frac exp:exp _ { return parseFloat([int,frac,exp].join('')); }
  / int:int frac:frac _     { return parseFloat([int,frac].join('')); }
  / int:int exp:exp _      { return parseFloat([int,exp].join('')); }
  / int:int _          { return parseFloat(int); }

int
  = digits:digits { return digits.join(''); }
  / "-" digits:digits { return ['-'].concat(digits).join(''); }

frac
  = "." digits:digits { return ['.'].concat(digits).join(''); }

exp
  = e digits:digits { return ['e'].concat(digits).join(''); }

digits
  = digit+

e
  = [eE] [+-]?

digit
  = [0-9]

digit19
  = [1-9]

hexDigit
  = [0-9a-fA-F]

/* ===== Whitespace ===== */

_ "whitespace"
  = whitespace*

// Whitespace is undefined in the original JSON grammar, so I assume a simple
// conventional definition consistent with ECMA-262, 5th ed.
whitespace
  = comment
  / [ \t\n\r]


lineTermChar
  = [\n\r\u2028\u2029]

lineTerm "end of line"
  = "\r\n"
  / "\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

sourceChar
  = .

// should also deal with comment.
comment
  = multiLineComment
  / singleLineComment

singleLineCommentStart
  = '//' // c style

singleLineComment
  = singleLineCommentStart chars:(!lineTermChar sourceChar)* lineTerm? { 
    return {comment: chars.join('')}; 
  }

multiLineComment
  = '/*' chars:(!'*/' sourceChar)* '*/' { return {comment: chars.join('')}; }
