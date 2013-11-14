
define(['require','builtin'], function(require) {

// src/covalent
var ___SRC_COVALENT___ = (function(module) {
  module.exports = (function(){
  
  
  function quote(s) {
    
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    
      .replace(/\x08/g, '\\b') 
      .replace(/\t/g, '\\t')   
      .replace(/\n/g, '\\n')   
      .replace(/\f/g, '\\f')   
      .replace(/\r/g, '\\r')   
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    
    parse: function(input, startRule) {
      var parseFunctions = {
        "START": parse_START,
        "Statement": parse_Statement,
        "Expression": parse_Expression,
        "NotExpression": parse_NotExpression,
        "ParenedExpression": parse_ParenedExpression,
        "MultiplyExpression": parse_MultiplyExpression,
        "_tailMultiplyExp": parse__tailMultiplyExp,
        "AddExpression": parse_AddExpression,
        "_tailAddExp": parse__tailAddExp,
        "CompareExpression": parse_CompareExpression,
        "_tailCompareExp": parse__tailCompareExp,
        "AndExpression": parse_AndExpression,
        "_tailAndExp": parse__tailAndExp,
        "OrExpression": parse_OrExpression,
        "_tailOrExp": parse__tailOrExp,
        "AssignmentExpression": parse_AssignmentExpression,
        "BlockExpression": parse_BlockExpression,
        "_blockExp": parse__blockExp,
        "_tailBlockExp": parse__tailBlockExp,
        "IfExpression": parse_IfExpression,
        "TryCatchExpression": parse_TryCatchExpression,
        "_catchErrorExpression": parse__catchErrorExpression,
        "ThrowExpression": parse_ThrowExpression,
        "FunctionDeclaration": parse_FunctionDeclaration,
        "_functionParamsExp": parse__functionParamsExp,
        "_functionParamExp": parse__functionParamExp,
        "_tailFunctionParamExp": parse__tailFunctionParamExp,
        "FuncallExpression": parse_FuncallExpression,
        "_funcallParamsExp": parse__funcallParamsExp,
        "_tailFuncallParamExp": parse__tailFuncallParamExp,
        "InitBlockExpression": parse_InitBlockExpression,
        "BindingExpression": parse_BindingExpression,
        "BindingBlockExpression": parse_BindingBlockExpression,
        "TopLevelBindingBlockExpression": parse_TopLevelBindingBlockExpression,
        "NakedBindingBlockExpression": parse_NakedBindingBlockExpression,
        "_bindingBlockExp": parse__bindingBlockExp,
        "_tailBindingBlockExp": parse__tailBindingBlockExp,
        "EachBlockExpression": parse_EachBlockExpression,
        "WithBlockExpression": parse_WithBlockExpression,
        "TextBlockExpression": parse_TextBlockExpression,
        "TemplateBlockExpression": parse_TemplateBlockExpression,
        "AtRulesBlockExpression": parse_AtRulesBlockExpression,
        "_atRulesBlockExp": parse__atRulesBlockExp,
        "_tailAtRulesBlockExp": parse__tailAtRulesBlockExp,
        "PropertyBindingExpression": parse_PropertyBindingExpression,
        "SelectorExpression": parse_SelectorExpression,
        "CompoundSelectorExp": parse_CompoundSelectorExp,
        "SingleSelectorExp": parse_SingleSelectorExp,
        "ElementSelectorExp": parse_ElementSelectorExp,
        "SelectorModifierExp": parse_SelectorModifierExp,
        "ClassSelectorExp": parse_ClassSelectorExp,
        "IDSelectorExp": parse_IDSelectorExp,
        "AttributeSelectorExp": parse_AttributeSelectorExp,
        "PseudoElementSelectorExp": parse_PseudoElementSelectorExp,
        "DescendentSelectorExp": parse_DescendentSelectorExp,
        "ChildSelectorExp": parse_ChildSelectorExp,
        "ImmediatePrecedeSelectorExp": parse_ImmediatePrecedeSelectorExp,
        "PrecedeSelectorExp": parse_PrecedeSelectorExp,
        "GroupSelectorExp": parse_GroupSelectorExp,
        "_tailGroupSelectorExp": parse__tailGroupSelectorExp,
        "AtomicExpression": parse_AtomicExpression,
        "ObjectExpression": parse_ObjectExpression,
        "objKeyValPairExp": parse_objKeyValPairExp,
        "objKeyExp": parse_objKeyExp,
        "objValExp": parse_objValExp,
        "ThisElement": parse_ThisElement,
        "Reference": parse_Reference,
        "ReferencePath": parse_ReferencePath,
        "ReferencePathHead": parse_ReferencePathHead,
        "ReferencePathRest": parse_ReferencePathRest,
        "Identifier": parse_Identifier,
        "idChar1": parse_idChar1,
        "idChar": parse_idChar,
        "Keywords": parse_Keywords,
        "Literal": parse_Literal,
        "XHTMLExpression": parse_XHTMLExpression,
        "OpenElementExp": parse_OpenElementExp,
        "CloseElementExp": parse_CloseElementExp,
        "SingleElementExp": parse_SingleElementExp,
        "StartElementExp": parse_StartElementExp,
        "AttributeExp": parse_AttributeExp,
        "ChildXHTMLExpression": parse_ChildXHTMLExpression,
        "XHTMLContentExpression": parse_XHTMLContentExpression,
        "XHTMLContentChar": parse_XHTMLContentChar,
        "__": parse___,
        "XHTMLComment": parse_XHTMLComment,
        "XHTMLCommentClose": parse_XHTMLCommentClose,
        "XHTMLCommentChar": parse_XHTMLCommentChar,
        "String": parse_String,
        "chars": parse_chars,
        "char": parse_char,
        "hexDigit4": parse_hexDigit4,
        "Number": parse_Number,
        "int": parse_int,
        "frac": parse_frac,
        "exp": parse_exp,
        "digits": parse_digits,
        "e": parse_e,
        "digit": parse_digit,
        "digit19": parse_digit19,
        "hexDigit": parse_hexDigit,
        "_": parse__,
        "whitespace": parse_whitespace,
        "lineTermChar": parse_lineTermChar,
        "lineTerm": parse_lineTerm,
        "sourceChar": parse_sourceChar,
        "comment": parse_comment,
        "singleLineCommentStart": parse_singleLineCommentStart,
        "singleLineComment": parse_singleLineComment,
        "multiLineComment": parse_multiLineComment
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "START";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_START() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__();
        if (result0 !== null) {
          result1 = parse_Statement();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_Statement();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_Statement();
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { 
            if (rest.length == 0) {
              return head; 
            } else {
              return [ head ].concat(rest);
            }
          })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Statement() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_FunctionDeclaration();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_InitBlockExpression();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_BindingExpression();
            if (result0 !== null) {
              result1 = parse__();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_Expression();
              if (result0 !== null) {
                result1 = parse__();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_TopLevelBindingBlockExpression();
                if (result0 !== null) {
                  result1 = parse__();
                  if (result1 !== null) {
                    result0 = [result0, result1];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  pos1 = pos;
                  result0 = parse_XHTMLExpression();
                  if (result0 !== null) {
                    result1 = parse__();
                    if (result1 !== null) {
                      result0 = [result0, result1];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                  if (result0 !== null) {
                    result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_Expression() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_FunctionDeclaration();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_BlockExpression();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_IfExpression();
            if (result0 !== null) {
              result1 = parse__();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_TryCatchExpression();
              if (result0 !== null) {
                result1 = parse__();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_ThrowExpression();
                if (result0 !== null) {
                  result1 = parse__();
                  if (result1 !== null) {
                    result0 = [result0, result1];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  pos1 = pos;
                  result0 = parse_AssignmentExpression();
                  if (result0 !== null) {
                    result1 = parse__();
                    if (result1 !== null) {
                      result0 = [result0, result1];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                  if (result0 !== null) {
                    result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_OrExpression();
                    if (result0 !== null) {
                      result1 = parse__();
                      if (result1 !== null) {
                        result0 = [result0, result1];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                    if (result0 !== null) {
                      result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                    if (result0 === null) {
                      pos0 = pos;
                      pos1 = pos;
                      result0 = parse_FuncallExpression();
                      if (result0 !== null) {
                        result1 = parse__();
                        if (result1 !== null) {
                          result0 = [result0, result1];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                      if (result0 !== null) {
                        result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                      }
                      if (result0 === null) {
                        pos = pos0;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_NotExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 33) {
          result0 = "!";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"!\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Expression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return { op: '!', lhs: exp }; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ParenedExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Expression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_MultiplyExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_AtomicExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailMultiplyExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailMultiplyExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return leftAssociative(lhs, rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailMultiplyExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 42) {
          result0 = "*";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"*\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 47) {
            result0 = "/";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 37) {
              result0 = "%";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"%\"");
              }
            }
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_AtomicExpression();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, rhs) { return {op: op, rhs: rhs}; })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AddExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_MultiplyExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailAddExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailAddExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return leftAssociative(lhs, rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailAddExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 43) {
          result0 = "+";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"+\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 45) {
            result0 = "-";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_MultiplyExpression();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, rhs) { return {op: op, rhs: rhs}; })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_CompareExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_AddExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailCompareExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailCompareExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return leftAssociative(lhs, rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailCompareExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "<=") {
          result0 = "<=";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"<=\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 60) {
            result0 = "<";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"<\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 2) === ">=") {
              result0 = ">=";
              pos += 2;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\">=\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 62) {
                result0 = ">";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\">\"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 2) === "==") {
                  result0 = "==";
                  pos += 2;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"==\"");
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 2) === "!=") {
                    result0 = "!=";
                    pos += 2;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"!=\"");
                    }
                  }
                }
              }
            }
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_AddExpression();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, rhs) { return {op: op, rhs: rhs}; })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AndExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_CompareExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailAndExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailAndExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return leftAssociative(lhs, rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailAndExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "&&") {
          result0 = "&&";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"&&\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_CompareExpression();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, rhs) { return {op: op, rhs: rhs}; })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_OrExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_AndExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailOrExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailOrExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return leftAssociative(lhs, rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailOrExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "||") {
          result0 = "||";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"||\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_AndExpression();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, op, rhs) { return {op: op, rhs: rhs}; })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AssignmentExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Reference();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 61) {
              result2 = "=";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"=\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse__blockExp();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, op, exp) { 
            if (exp.cell) {
              return {cellAlias: lhs.cell, exp: exp.cell};
            } else {
              return {cellSet: lhs.cell, exp: exp };
            }
          })(pos0, result0[0], result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_BlockExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 123) {
          result0 = "{";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse__blockExp();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = [];
                result5 = parse__tailBlockExp();
                while (result5 !== null) {
                  result4.push(result5);
                  result5 = parse__tailBlockExp();
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 125) {
                      result6 = "}";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"}\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { 
            if (rest.length == 0) {
               return head;
            } else {
              return {block: [ head ].concat(rest)}; 
            }
          })(pos0, result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__blockExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Expression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 59) {
              result2 = ";";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\";\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailBlockExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__();
        if (result0 !== null) {
          result1 = parse__blockExp();
          if (result1 !== null) {
            result2 = parse__();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_IfExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "if") {
          result0 = "if";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"if\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_OrExpression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_BlockExpression();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.substr(pos, 4) === "else") {
                      result6 = "else";
                      pos += 4;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"else\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result8 = parse_BlockExpression();
                        if (result8 !== null) {
                          result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, cond, lhs, rhs) {
            return {if: cond, then: lhs, else: rhs};
          })(pos0, result0[2], result0[4], result0[8]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.substr(pos, 2) === "if") {
            result0 = "if";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"if\"");
            }
          }
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result2 = parse_OrExpression();
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result4 = parse_BlockExpression();
                  if (result4 !== null) {
                    result0 = [result0, result1, result2, result3, result4];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, cond, lhs) {
              return {if: cond, then: lhs};
            })(pos0, result0[2], result0[4]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_TryCatchExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13, result14, result15, result16, result17;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "try") {
          result0 = "try";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"try\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_BlockExpression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.substr(pos, 5) === "catch") {
                  result4 = "catch";
                  pos += 5;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"catch\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 40) {
                      result6 = "(";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"(\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result8 = parse_Identifier();
                        if (result8 !== null) {
                          result9 = parse__();
                          if (result9 !== null) {
                            if (input.charCodeAt(pos) === 41) {
                              result10 = ")";
                              pos++;
                            } else {
                              result10 = null;
                              if (reportFailures === 0) {
                                matchFailed("\")\"");
                              }
                            }
                            if (result10 !== null) {
                              result11 = parse__();
                              if (result11 !== null) {
                                result12 = parse_BlockExpression();
                                if (result12 !== null) {
                                  result13 = parse__();
                                  if (result13 !== null) {
                                    if (input.substr(pos, 7) === "finally") {
                                      result14 = "finally";
                                      pos += 7;
                                    } else {
                                      result14 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\"finally\"");
                                      }
                                    }
                                    if (result14 !== null) {
                                      result15 = parse__();
                                      if (result15 !== null) {
                                        result16 = parse_BlockExpression();
                                        if (result16 !== null) {
                                          result17 = parse__();
                                          if (result17 !== null) {
                                            result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13, result14, result15, result16, result17];
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, tryExp, id, catchExp, finallyExp) {
            return {try: tryExp, 
                   catch: {function: null, args: [{name: id}], body: catchExp}, 
                   finally: finallyExp};
          })(pos0, result0[2], result0[8], result0[12], result0[16]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.substr(pos, 3) === "try") {
            result0 = "try";
            pos += 3;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"try\"");
            }
          }
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result2 = parse_BlockExpression();
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  if (input.substr(pos, 5) === "catch") {
                    result4 = "catch";
                    pos += 5;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"catch\"");
                    }
                  }
                  if (result4 !== null) {
                    result5 = parse__();
                    if (result5 !== null) {
                      result6 = parse__catchErrorExpression();
                      if (result6 !== null) {
                        result7 = parse__();
                        if (result7 !== null) {
                          result8 = parse_BlockExpression();
                          if (result8 !== null) {
                            result9 = parse__();
                            if (result9 !== null) {
                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9];
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, tryExp, id, catchExp) {
              return {try: tryExp, catch: {function: null, args: [{name: id}], body: catchExp}};
            })(pos0, result0[2], result0[6], result0[8]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse__catchErrorExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Identifier();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) { return id; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_Identifier();
        }
        return result0;
      }
      
      function parse_ThrowExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "throw") {
          result0 = "throw";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"throw\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Expression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) {
            return {throw: exp};
          })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_FunctionDeclaration() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 8) === "function") {
          result0 = "function";
          pos += 8;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"function\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Identifier();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 40) {
                  result4 = "(";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"(\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 41) {
                      result6 = ")";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\")\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result8 = parse_BlockExpression();
                        if (result8 !== null) {
                          result9 = parse__();
                          if (result9 !== null) {
                            result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9];
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name, exp) {
            return { function: name, args: [], body: exp }; 
          })(pos0, result0[2], result0[8]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.substr(pos, 8) === "function") {
            result0 = "function";
            pos += 8;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"function\"");
            }
          }
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result2 = parse_Identifier();
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  if (input.charCodeAt(pos) === 40) {
                    result4 = "(";
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"(\"");
                    }
                  }
                  if (result4 !== null) {
                    result5 = parse__();
                    if (result5 !== null) {
                      result6 = parse__functionParamsExp();
                      if (result6 !== null) {
                        result7 = parse__();
                        if (result7 !== null) {
                          if (input.charCodeAt(pos) === 41) {
                            result8 = ")";
                            pos++;
                          } else {
                            result8 = null;
                            if (reportFailures === 0) {
                              matchFailed("\")\"");
                            }
                          }
                          if (result8 !== null) {
                            result9 = parse__();
                            if (result9 !== null) {
                              result10 = parse_BlockExpression();
                              if (result10 !== null) {
                                result11 = parse__();
                                if (result11 !== null) {
                                  result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11];
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, name, args, exp) {
              return { function: name, args: args, body: exp }; 
            })(pos0, result0[2], result0[6], result0[10]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse__functionParamsExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__functionParamExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailFunctionParamExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailFunctionParamExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return [ lhs ].concat(rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__functionParamExp() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result0 = (function(offset, id) { return {name: id}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailFunctionParamExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 44) {
          result0 = ",";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\",\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse__functionParamExp();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, param) { return param; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_FuncallExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 40) {
              result2 = "(";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"(\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) { return { funcall: {id: id}, args: []}; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_Identifier();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 40) {
                result2 = "(";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"(\"");
                }
              }
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result4 = parse__funcallParamsExp();
                  if (result4 !== null) {
                    result5 = parse__();
                    if (result5 !== null) {
                      if (input.charCodeAt(pos) === 41) {
                        result6 = ")";
                        pos++;
                      } else {
                        result6 = null;
                        if (reportFailures === 0) {
                          matchFailed("\")\"");
                        }
                      }
                      if (result6 !== null) {
                        result7 = parse__();
                        if (result7 !== null) {
                          result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, id, args) {
              return { funcall: {id: id}, args: args }; 
            })(pos0, result0[0], result0[4]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse__funcallParamsExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_OrExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailFuncallParamExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailFuncallParamExp();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, lhs, rest) { return [ lhs ].concat(rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailFuncallParamExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 44) {
          result0 = ",";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\",\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_OrExpression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, rhs) { return rhs; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_InitBlockExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "@init") {
          result0 = "@init";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@init\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_BlockExpression();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { 
            return {init: exp};
          })(pos0, result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_BindingExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SelectorExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_BindingBlockExpression();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, select, exp) {
            return {select: select, bindings: exp};
          })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_BindingBlockExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 123) {
          result0 = "{";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse__bindingBlockExp();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = [];
                result5 = parse__tailBindingBlockExp();
                while (result5 !== null) {
                  result4.push(result5);
                  result5 = parse__tailBindingBlockExp();
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 125) {
                      result6 = "}";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"}\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { 
            return [ head ].concat(rest); 
          })(pos0, result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_TopLevelBindingBlockExpression() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_BindingBlockExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, bindings) { return { bindings: bindings }; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_NakedBindingBlockExpression();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, bindings) { return bindings; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_NakedBindingBlockExpression() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__bindingBlockExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse__tailBindingBlockExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse__tailBindingBlockExp();
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) {
            return {bindings: [ head ].concat(rest) };
          })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__bindingBlockExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_EachBlockExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 59) {
              result2 = ";";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\";\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_WithBlockExpression();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 59) {
                result2 = ";";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\";\"");
                }
              }
              result2 = result2 !== null ? result2 : "";
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result0 = [result0, result1, result2, result3];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_TemplateBlockExpression();
            if (result0 !== null) {
              result1 = parse__();
              if (result1 !== null) {
                if (input.charCodeAt(pos) === 59) {
                  result2 = ";";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\";\"");
                  }
                }
                result2 = result2 !== null ? result2 : "";
                if (result2 !== null) {
                  result3 = parse__();
                  if (result3 !== null) {
                    result0 = [result0, result1, result2, result3];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_TextBlockExpression();
              if (result0 !== null) {
                result1 = parse__();
                if (result1 !== null) {
                  if (input.charCodeAt(pos) === 59) {
                    result2 = ";";
                    pos++;
                  } else {
                    result2 = null;
                    if (reportFailures === 0) {
                      matchFailed("\";\"");
                    }
                  }
                  result2 = result2 !== null ? result2 : "";
                  if (result2 !== null) {
                    result3 = parse__();
                    if (result3 !== null) {
                      result0 = [result0, result1, result2, result3];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_AtRulesBlockExpression();
                if (result0 !== null) {
                  result1 = parse__();
                  if (result1 !== null) {
                    if (input.charCodeAt(pos) === 59) {
                      result2 = ";";
                      pos++;
                    } else {
                      result2 = null;
                      if (reportFailures === 0) {
                        matchFailed("\";\"");
                      }
                    }
                    result2 = result2 !== null ? result2 : "";
                    if (result2 !== null) {
                      result3 = parse__();
                      if (result3 !== null) {
                        result0 = [result0, result1, result2, result3];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  pos1 = pos;
                  result0 = parse_PropertyBindingExpression();
                  if (result0 !== null) {
                    result1 = parse__();
                    if (result1 !== null) {
                      if (input.charCodeAt(pos) === 59) {
                        result2 = ";";
                        pos++;
                      } else {
                        result2 = null;
                        if (reportFailures === 0) {
                          matchFailed("\";\"");
                        }
                      }
                      result2 = result2 !== null ? result2 : "";
                      if (result2 !== null) {
                        result3 = parse__();
                        if (result3 !== null) {
                          result0 = [result0, result1, result2, result3];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                  if (result0 !== null) {
                    result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_Expression();
                    if (result0 !== null) {
                      result1 = parse__();
                      if (result1 !== null) {
                        if (input.charCodeAt(pos) === 59) {
                          result2 = ";";
                          pos++;
                        } else {
                          result2 = null;
                          if (reportFailures === 0) {
                            matchFailed("\";\"");
                          }
                        }
                        result2 = result2 !== null ? result2 : "";
                        if (result2 !== null) {
                          result3 = parse__();
                          if (result3 !== null) {
                            result0 = [result0, result1, result2, result3];
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                    if (result0 !== null) {
                      result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse__tailBindingBlockExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__();
        if (result0 !== null) {
          result1 = parse__bindingBlockExp();
          if (result1 !== null) {
            result2 = parse__();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_EachBlockExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "@each") {
          result0 = "@each";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@each\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_Reference();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 44) {
                      result6 = ",";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\",\"");
                      }
                    }
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result8 = parse_String();
                        if (result8 !== null) {
                          result9 = parse__();
                          if (result9 !== null) {
                            if (input.charCodeAt(pos) === 59) {
                              result10 = ";";
                              pos++;
                            } else {
                              result10 = null;
                              if (reportFailures === 0) {
                                matchFailed("\";\"");
                              }
                            }
                            result10 = result10 !== null ? result10 : "";
                            if (result10 !== null) {
                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10];
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id, name) { return { each : id.cell , template: name }; })(pos0, result0[4], result0[8]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.substr(pos, 5) === "@each") {
            result0 = "@each";
            pos += 5;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"@each\"");
            }
          }
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result2 = ":";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              result2 = result2 !== null ? result2 : "";
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result4 = parse_Reference();
                  if (result4 !== null) {
                    result5 = parse__();
                    if (result5 !== null) {
                      if (input.charCodeAt(pos) === 59) {
                        result6 = ";";
                        pos++;
                      } else {
                        result6 = null;
                        if (reportFailures === 0) {
                          matchFailed("\";\"");
                        }
                      }
                      result6 = result6 !== null ? result6 : "";
                      if (result6 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, id) { return { each : id.cell }; })(pos0, result0[4]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_WithBlockExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "@with") {
          result0 = "@with";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@with\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_Reference();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) { return { with: id.cell }; })(pos0, result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_TextBlockExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "@text") {
          result0 = "@text";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@text\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_Expression();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return { at: 'text', bindings: [ {exp: exp} ] }; })(pos0, result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_TemplateBlockExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 9) === "@template") {
          result0 = "@template";
          pos += 9;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@template\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_String();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return { template: exp }; })(pos0, result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AtRulesBlockExpression() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 64) {
          result0 = "@";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Identifier();
          if (result1 !== null) {
            result2 = parse__();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result3 = ":";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result4 = parse__();
                if (result4 !== null) {
                  if (input.charCodeAt(pos) === 123) {
                    result5 = "{";
                    pos++;
                  } else {
                    result5 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"{\"");
                    }
                  }
                  if (result5 !== null) {
                    result6 = parse__();
                    if (result6 !== null) {
                      result7 = parse__atRulesBlockExp();
                      if (result7 !== null) {
                        result8 = parse__();
                        if (result8 !== null) {
                          result9 = [];
                          result10 = parse__tailAtRulesBlockExp();
                          while (result10 !== null) {
                            result9.push(result10);
                            result10 = parse__tailAtRulesBlockExp();
                          }
                          if (result9 !== null) {
                            result10 = parse__();
                            if (result10 !== null) {
                              if (input.charCodeAt(pos) === 125) {
                                result11 = "}";
                                pos++;
                              } else {
                                result11 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"}\"");
                                }
                              }
                              if (result11 !== null) {
                                result12 = parse__();
                                if (result12 !== null) {
                                  result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12];
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id, head, rest) { 
            return {at: id, bindings: [ head ].concat(rest)}; 
          })(pos0, result0[1], result0[7], result0[9]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__atRulesBlockExp() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_PropertyBindingExpression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 59) {
              result2 = ";";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\";\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_Expression();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 59) {
                result2 = ";";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\";\"");
                }
              }
              result2 = result2 !== null ? result2 : "";
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result0 = [result0, result1, result2, result3];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse__tailAtRulesBlockExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__();
        if (result0 !== null) {
          result1 = parse__atRulesBlockExp();
          if (result1 !== null) {
            result2 = parse__();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_PropertyBindingExpression() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_Expression();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id, exp) { return {prop: id, exp: exp}; })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_String();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result2 = ":";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result4 = parse_exp();
                  if (result4 !== null) {
                    if (input.length > pos) {
                      result5 = input.charAt(pos);
                      pos++;
                    } else {
                      result5 = null;
                      if (reportFailures === 0) {
                        matchFailed("any character");
                      }
                    }
                    if (result5 !== null) {
                      result6 = parse_Expression();
                      if (result6 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, id) { return {prop: id, exp: exp}; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_SelectorExpression() {
        var result0;
        
        result0 = parse_GroupSelectorExp();
        if (result0 === null) {
          result0 = parse_CompoundSelectorExp();
        }
        return result0;
      }
      
      function parse_CompoundSelectorExp() {
        var result0;
        
        result0 = parse_DescendentSelectorExp();
        if (result0 === null) {
          result0 = parse_ChildSelectorExp();
          if (result0 === null) {
            result0 = parse_ImmediatePrecedeSelectorExp();
            if (result0 === null) {
              result0 = parse_PrecedeSelectorExp();
              if (result0 === null) {
                result0 = parse_SingleSelectorExp();
                if (result0 === null) {
                  result0 = parse_AttributeSelectorExp();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_SingleSelectorExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_ElementSelectorExp();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_SelectorModifierExp();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_SelectorModifierExp();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, elt, mods) {
            return normalizeSelector(elt, mods); 
          })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ElementSelectorExp() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result0 = (function(offset, elt) { return {elt: elt}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.charCodeAt(pos) === 42) {
            result0 = "*";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"*\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset) { return {elt: '*'}; })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_ClassSelectorExp();
            if (result0 !== null) {
              result0 = (function(offset, exp) { return normalizeSelector({elt: '*'}, [ exp ]); })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              result0 = parse_IDSelectorExp();
              if (result0 !== null) {
                result0 = (function(offset, exp) { return normalizeSelector({elt: '*'}, [ exp ]); })(pos0, result0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                result0 = parse_AttributeSelectorExp();
                if (result0 !== null) {
                  result0 = (function(offset, exp) { return normalizeSelector({elt: '*'}, [ exp ]); })(pos0, result0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_SelectorModifierExp() {
        var result0;
        
        result0 = parse_ClassSelectorExp();
        if (result0 === null) {
          result0 = parse_IDSelectorExp();
          if (result0 === null) {
            result0 = parse_AttributeSelectorExp();
            if (result0 === null) {
              result0 = parse_PseudoElementSelectorExp();
            }
          }
        }
        return result0;
      }
      
      function parse_ClassSelectorExp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 46) {
          result0 = ".";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\".\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Identifier();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, cls) { return {class: cls}; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_IDSelectorExp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 35) {
          result0 = "#";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"#\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Identifier();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) { return {id: id}; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AttributeSelectorExp() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 91) {
          result0 = "[";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"[\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_Identifier();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 93) {
                  result4 = "]";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"]\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, attr) { return { attr: attr }; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 91) {
            result0 = "[";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"[\"");
            }
          }
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result2 = parse_Identifier();
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  if (input.charCodeAt(pos) === 61) {
                    result4 = "=";
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"=\"");
                    }
                  }
                  if (result4 === null) {
                    if (input.substr(pos, 2) === "~=") {
                      result4 = "~=";
                      pos += 2;
                    } else {
                      result4 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"~=\"");
                      }
                    }
                    if (result4 === null) {
                      if (input.substr(pos, 2) === "^=") {
                        result4 = "^=";
                        pos += 2;
                      } else {
                        result4 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"^=\"");
                        }
                      }
                      if (result4 === null) {
                        if (input.substr(pos, 2) === "$=") {
                          result4 = "$=";
                          pos += 2;
                        } else {
                          result4 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"$=\"");
                          }
                        }
                        if (result4 === null) {
                          if (input.substr(pos, 2) === "*=") {
                            result4 = "*=";
                            pos += 2;
                          } else {
                            result4 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"*=\"");
                            }
                          }
                          if (result4 === null) {
                            if (input.substr(pos, 2) === "|=") {
                              result4 = "|=";
                              pos += 2;
                            } else {
                              result4 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"|=\"");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (result4 !== null) {
                    result5 = parse__();
                    if (result5 !== null) {
                      result6 = parse_Literal();
                      if (result6 !== null) {
                        result7 = parse__();
                        if (result7 !== null) {
                          if (input.charCodeAt(pos) === 93) {
                            result8 = "]";
                            pos++;
                          } else {
                            result8 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"]\"");
                            }
                          }
                          if (result8 !== null) {
                            result9 = parse__();
                            if (result9 !== null) {
                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9];
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, attr, op, val) { 
              return { attr: attr, op: op, arg: val};
            })(pos0, result0[2], result0[4], result0[6]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_PseudoElementSelectorExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 58) {
          result0 = ":";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\":\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Identifier();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 40) {
              result2 = "(";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"(\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_Literal();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name, arg) { 
            return { pseudo: name, args: [ arg ] };
          })(pos0, result0[1], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 58) {
            result0 = ":";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_Identifier();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, name) { 
              return { pseudo: name };
            })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_DescendentSelectorExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SingleSelectorExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_SingleSelectorExp();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, ancestor, descendent) { 
            return normalizeSelectorRelation(descendent, 'ancestor', ancestor);
          })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ChildSelectorExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SingleSelectorExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 62) {
              result2 = ">";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\">\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_SingleSelectorExp();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, parent, child) {
            return normalizeSelectorRelation(child, 'parent', parent);
          })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ImmediatePrecedeSelectorExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SingleSelectorExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 43) {
              result2 = "+";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"+\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_SingleSelectorExp();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, precede, recede) {
            return normalizeSelectorRelation(recede, 'immediatePrecede', precede);
          })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_PrecedeSelectorExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SingleSelectorExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 126) {
              result2 = "~";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"~\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_SingleSelectorExp();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, precede, recede) {
            return normalizeSelectorRelation(recede, 'precede', precede);
          })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_GroupSelectorExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_CompoundSelectorExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse__tailGroupSelectorExp();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { return [ head ].concat(rest); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse__tailGroupSelectorExp() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 44) {
          result0 = ",";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\",\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_CompoundSelectorExp();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AtomicExpression() {
        var result0, result1;
        var pos0, pos1;
        
        result0 = parse_ParenedExpression();
        if (result0 === null) {
          result0 = parse_NotExpression();
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_Literal();
            if (result0 !== null) {
              result1 = parse__();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, lit) { return lit; })(pos0, result0[0]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_FuncallExpression();
              if (result0 !== null) {
                result1 = parse__();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, func) { return func; })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                result0 = parse_ThisElement();
                if (result0 === null) {
                  pos0 = pos;
                  pos1 = pos;
                  result0 = parse_Reference();
                  if (result0 !== null) {
                    result1 = parse__();
                    if (result1 !== null) {
                      result0 = [result0, result1];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                  if (result0 !== null) {
                    result0 = (function(offset, ref) { return ref; })(pos0, result0[0]);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_ObjectExpression();
                    if (result0 !== null) {
                      result1 = parse__();
                      if (result1 !== null) {
                        result0 = [result0, result1];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                    if (result0 !== null) {
                      result0 = (function(offset, obj) { return obj; })(pos0, result0[0]);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_ObjectExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 123) {
          result0 = "{";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"{\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_objKeyValPairExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_objKeyValPairExp();
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 125) {
                  result4 = "}";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"}\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, keyvals) { return {object: keyvals}; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_objKeyValPairExp() {
        var result0, result1, result2, result3, result4, result5, result6, result7;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_objKeyExp();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 58) {
              result2 = ":";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_objValExp();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 44) {
                      result6 = ",";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\",\"");
                      }
                    }
                    result6 = result6 !== null ? result6 : "";
                    if (result6 !== null) {
                      result7 = parse__();
                      if (result7 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, key, val) { return [ key, val ]; })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_objKeyExp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_String();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, str) { return str; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_Identifier();
          if (result0 !== null) {
            result1 = parse__();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, id) { return id; })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_objValExp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Expression();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, exp) { return exp; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ThisElement() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 4) === "this") {
          result0 = "this";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"this\"");
          }
        }
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 46) {
              result2 = ".";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_Identifier();
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, prop) { return { element: 'this', prop: prop } ; })(pos0, result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.substr(pos, 4) === "this") {
            result0 = "this";
            pos += 4;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"this\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset) { return { element: 'this' }; })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_Reference() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "$/") {
          result0 = "$/";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"$/\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_ReferencePath();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, path) { return { cell : '/' + path }; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 36) {
            result0 = "$";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"$\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_ReferencePath();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, path) { return { cell: path }; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_Identifier();
            if (result0 !== null) {
              result0 = (function(offset, id) { return {id: id}; })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
        }
        return result0;
      }
      
      function parse_ReferencePath() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_ReferencePathHead();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ReferencePathRest();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ReferencePathRest();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { return makeString(head, rest); })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.charCodeAt(pos) === 46) {
            result0 = ".";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset) { return '.'; })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_ReferencePathHead() {
        var result0;
        
        result0 = parse_Identifier();
        if (result0 === null) {
          result0 = parse_Number();
        }
        return result0;
      }
      
      function parse_ReferencePathRest() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 46) {
          result0 = ".";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\".\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_ReferencePathHead();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, id) { return '.' + id; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Identifier() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        reportFailures++;
        result0 = parse_Keywords();
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos2;
        }
        if (result0 !== null) {
          result1 = parse_idChar1();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_idChar();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_idChar();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, rest) { return makeString(head, rest); })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_idChar1() {
        var result0;
        
        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result0 === null) {
          if (/^[A-Z]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[A-Z]");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 95) {
              result0 = "_";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"_\"");
              }
            }
          }
        }
        return result0;
      }
      
      function parse_idChar() {
        var result0;
        
        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result0 === null) {
          if (/^[A-Z]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[A-Z]");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 45) {
              result0 = "-";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"-\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 95) {
                result0 = "_";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"_\"");
                }
              }
              if (result0 === null) {
                if (/^[0-9]/.test(input.charAt(pos))) {
                  result0 = input.charAt(pos);
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("[0-9]");
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_Keywords() {
        var result0;
        
        if (input.substr(pos, 2) === "if") {
          result0 = "if";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"if\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 4) === "else") {
            result0 = "else";
            pos += 4;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"else\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 3) === "try") {
              result0 = "try";
              pos += 3;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"try\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 5) === "catch") {
                result0 = "catch";
                pos += 5;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"catch\"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 5) === "throw") {
                  result0 = "throw";
                  pos += 5;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"throw\"");
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 7) === "finally") {
                    result0 = "finally";
                    pos += 7;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"finally\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.substr(pos, 8) === "function") {
                      result0 = "function";
                      pos += 8;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"function\"");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_Literal() {
        var result0;
        var pos0;
        
        result0 = parse_String();
        if (result0 === null) {
          result0 = parse_Number();
          if (result0 === null) {
            pos0 = pos;
            if (input.substr(pos, 4) === "true") {
              result0 = "true";
              pos += 4;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"true\"");
              }
            }
            if (result0 !== null) {
              result0 = (function(offset) { return true; })(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              if (input.substr(pos, 5) === "false") {
                result0 = "false";
                pos += 5;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"false\"");
                }
              }
              if (result0 !== null) {
                result0 = (function(offset) { return false; })(pos0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                if (input.substr(pos, 4) === "null") {
                  result0 = "null";
                  pos += 4;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"null\"");
                  }
                }
                if (result0 !== null) {
                  result0 = (function(offset) { return null; })(pos0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_XHTMLExpression() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SingleElementExp();
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, elt) { return elt; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_OpenElementExp();
          if (result0 !== null) {
            result1 = [];
            result2 = parse_ChildXHTMLExpression();
            while (result2 !== null) {
              result1.push(result2);
              result2 = parse_ChildXHTMLExpression();
            }
            if (result1 !== null) {
              result2 = parse_CloseElementExp();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, start, children, close) {
              if (start.tag == close.tag) {
                return { element: start.tag, attributes: start.attributes, children: children };
              } else {
                throw new Error("invalid_xhtml_open_close_tag_unequal: " + start.tag);
              }
            })(pos0, result0[0], result0[1], result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_OpenElementExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_StartElementExp();
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_AttributeExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_AttributeExp();
            }
            if (result2 !== null) {
              result3 = parse___();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 62) {
                  result4 = ">";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\">\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, tag, attributes) {
            return { tag: tag, attributes: keyvalsToObject(attributes) };
          })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_CloseElementExp() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "</") {
          result0 = "</";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"</\"");
          }
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result2 = parse_Identifier();
            if (result2 !== null) {
              result3 = parse___();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 62) {
                  result4 = ">";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\">\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name) { 
            return {tag: name}; 
          })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SingleElementExp() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_StartElementExp();
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_AttributeExp();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_AttributeExp();
            }
            if (result2 !== null) {
              result3 = parse___();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 47) {
                  result4 = "/";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"/\"");
                  }
                }
                if (result4 !== null) {
                  result5 = parse___();
                  if (result5 !== null) {
                    if (input.charCodeAt(pos) === 62) {
                      result6 = ">";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\">\"");
                      }
                    }
                    if (result6 !== null) {
                      result0 = [result0, result1, result2, result3, result4, result5, result6];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, tag, attributes) {
            return { tag: tag, attributes: keyvalsToObject(attributes), children: [] };
          })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_StartElementExp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 60) {
          result0 = "<";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"<\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Identifier();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name) { 
            return name; 
          })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AttributeExp() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 61) {
              result2 = "=";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"=\"");
              }
            }
            if (result2 !== null) {
              result3 = parse___();
              if (result3 !== null) {
                result4 = parse_String();
                if (result4 !== null) {
                  result5 = parse___();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name, value) {
            return [name, value]; 
          })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ChildXHTMLExpression() {
        var result0;
        
        result0 = parse_XHTMLExpression();
        if (result0 === null) {
          result0 = parse_XHTMLContentExpression();
        }
        return result0;
      }
      
      function parse_XHTMLContentExpression() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_XHTMLContentChar();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_XHTMLContentChar();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { 
            return chars.join(''); 
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_XHTMLContentChar() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        result0 = parse_XHTMLComment();
        if (result0 !== null) {
          result0 = (function(offset) { return ''; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          result0 = parse_StartElementExp();
          reportFailures--;
          if (result0 === null) {
            result0 = "";
          } else {
            result0 = null;
            pos = pos2;
          }
          if (result0 !== null) {
            pos2 = pos;
            reportFailures++;
            result1 = parse_CloseElementExp();
            reportFailures--;
            if (result1 === null) {
              result1 = "";
            } else {
              result1 = null;
              pos = pos2;
            }
            if (result1 !== null) {
              if (input.length > pos) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("any character");
                }
              }
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, char) { 
              return char[2]; 
            })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse___() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_XHTMLComment();
        if (result1 === null) {
          result1 = parse_whitespace();
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_XHTMLComment();
          if (result1 === null) {
            result1 = parse_whitespace();
          }
        }
        return result0;
      }
      
      function parse_XHTMLComment() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 4) === "<!--") {
          result0 = "<!--";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"<!--\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_XHTMLCommentChar();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_XHTMLCommentChar();
          }
          if (result1 !== null) {
            result2 = parse_XHTMLCommentClose();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { 
            return { comment: chars.join('') }; 
          })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_XHTMLCommentClose() {
        var result0;
        
        if (input.substr(pos, 3) === "-->") {
          result0 = "-->";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-->\"");
          }
        }
        return result0;
      }
      
      function parse_XHTMLCommentChar() {
        var result0, result1;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        reportFailures++;
        result0 = parse_XHTMLCommentClose();
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos2;
        }
        if (result0 !== null) {
          if (input.length > pos) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("any character");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, char) { 
            return char[1]; 
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_String() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 34) {
          result0 = "\"";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_chars();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 34) {
              result2 = "\"";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\"\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 39) {
            result0 = "'";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"'\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_chars();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 39) {
                result2 = "'";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"'\"");
                }
              }
              if (result2 !== null) {
                result3 = parse__();
                if (result3 !== null) {
                  result0 = [result0, result1, result2, result3];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, chars) { return chars; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_chars() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_char();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_char();
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_char() {
        var result0, result1;
        var pos0, pos1;
        
        if (/^[^"'\\\0-\x1F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[^\"'\\\\\\0-\\x1F]");
          }
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.substr(pos, 2) === "\\\"") {
            result0 = "\\\"";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\\\\\"\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset) { return '"';  })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            if (input.substr(pos, 2) === "\\'") {
              result0 = "\\'";
              pos += 2;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\\'\"");
              }
            }
            if (result0 !== null) {
              result0 = (function(offset) { return "'"; })(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              if (input.substr(pos, 2) === "\\\\") {
                result0 = "\\\\";
                pos += 2;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\\\\\\\\"");
                }
              }
              if (result0 !== null) {
                result0 = (function(offset) { return "\\"; })(pos0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                if (input.substr(pos, 2) === "\\/") {
                  result0 = "\\/";
                  pos += 2;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"\\\\/\"");
                  }
                }
                if (result0 !== null) {
                  result0 = (function(offset) { return "/";  })(pos0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  if (input.substr(pos, 2) === "\\b") {
                    result0 = "\\b";
                    pos += 2;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"\\\\b\"");
                    }
                  }
                  if (result0 !== null) {
                    result0 = (function(offset) { return "\b"; })(pos0);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    if (input.substr(pos, 2) === "\\f") {
                      result0 = "\\f";
                      pos += 2;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"\\\\f\"");
                      }
                    }
                    if (result0 !== null) {
                      result0 = (function(offset) { return "\f"; })(pos0);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                    if (result0 === null) {
                      pos0 = pos;
                      if (input.substr(pos, 2) === "\\n") {
                        result0 = "\\n";
                        pos += 2;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"\\\\n\"");
                        }
                      }
                      if (result0 !== null) {
                        result0 = (function(offset) { return "\n"; })(pos0);
                      }
                      if (result0 === null) {
                        pos = pos0;
                      }
                      if (result0 === null) {
                        pos0 = pos;
                        if (input.substr(pos, 2) === "\\r") {
                          result0 = "\\r";
                          pos += 2;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"\\\\r\"");
                          }
                        }
                        if (result0 !== null) {
                          result0 = (function(offset) { return "\r"; })(pos0);
                        }
                        if (result0 === null) {
                          pos = pos0;
                        }
                        if (result0 === null) {
                          pos0 = pos;
                          if (input.substr(pos, 2) === "\\t") {
                            result0 = "\\t";
                            pos += 2;
                          } else {
                            result0 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"\\\\t\"");
                            }
                          }
                          if (result0 !== null) {
                            result0 = (function(offset) { return "\t"; })(pos0);
                          }
                          if (result0 === null) {
                            pos = pos0;
                          }
                          if (result0 === null) {
                            result0 = parse_whitespace();
                            if (result0 === null) {
                              pos0 = pos;
                              pos1 = pos;
                              if (input.substr(pos, 2) === "\\u") {
                                result0 = "\\u";
                                pos += 2;
                              } else {
                                result0 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"\\\\u\"");
                                }
                              }
                              if (result0 !== null) {
                                result1 = parse_hexDigit4();
                                if (result1 !== null) {
                                  result0 = [result0, result1];
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                              if (result0 !== null) {
                                result0 = (function(offset, digits) {
                                    return String.fromCharCode(parseInt("0x" + digits));
                                  })(pos0, result0[1]);
                              }
                              if (result0 === null) {
                                pos = pos0;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_hexDigit4() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_hexDigit();
        if (result0 !== null) {
          result1 = parse_hexDigit();
          if (result1 !== null) {
            result2 = parse_hexDigit();
            if (result2 !== null) {
              result3 = parse_hexDigit();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, h1, h2, h3, h4) { return h1+h2+h3+h4; })(pos0, result0[0], result0[1], result0[2], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Number() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_int();
        if (result0 !== null) {
          result1 = parse_frac();
          if (result1 !== null) {
            result2 = parse_exp();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, int, frac, exp) { return parseFloat([int,frac,exp].join('')); })(pos0, result0[0], result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_int();
          if (result0 !== null) {
            result1 = parse_frac();
            if (result1 !== null) {
              result2 = parse__();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, int, frac) { return parseFloat([int,frac].join('')); })(pos0, result0[0], result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_int();
            if (result0 !== null) {
              result1 = parse_exp();
              if (result1 !== null) {
                result2 = parse__();
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, int, exp) { return parseFloat([int,exp].join('')); })(pos0, result0[0], result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_int();
              if (result0 !== null) {
                result1 = parse__();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, int) { return parseFloat(int); })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
          }
        }
        return result0;
      }
      
      function parse_int() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_digits();
        if (result0 !== null) {
          result0 = (function(offset, digits) { return digits.join(''); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 45) {
            result0 = "-";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_digits();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, digits) { return ['-'].concat(digits).join(''); })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_frac() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 46) {
          result0 = ".";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\".\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_digits();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, digits) { return ['.'].concat(digits).join(''); })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_exp() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_e();
        if (result0 !== null) {
          result1 = parse_digits();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, digits) { return ['e'].concat(digits).join(''); })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_digits() {
        var result0, result1;
        
        result1 = parse_digit();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_digit();
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      function parse_e() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[eE]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[eE]");
          }
        }
        if (result0 !== null) {
          if (/^[+\-]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[+\\-]");
            }
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_digit() {
        var result0;
        
        if (/^[0-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        return result0;
      }
      
      function parse_digit19() {
        var result0;
        
        if (/^[1-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[1-9]");
          }
        }
        return result0;
      }
      
      function parse_hexDigit() {
        var result0;
        
        if (/^[0-9a-fA-F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9a-fA-F]");
          }
        }
        return result0;
      }
      
      function parse__() {
        var result0, result1;
        
        reportFailures++;
        result0 = [];
        result1 = parse_whitespace();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_whitespace();
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("whitespace");
        }
        return result0;
      }
      
      function parse_whitespace() {
        var result0;
        
        result0 = parse_comment();
        if (result0 === null) {
          if (/^[ \t\n\r]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[ \\t\\n\\r]");
            }
          }
        }
        return result0;
      }
      
      function parse_lineTermChar() {
        var result0;
        
        if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\n\\r\\u2028\\u2029]");
          }
        }
        return result0;
      }
      
      function parse_lineTerm() {
        var result0;
        
        reportFailures++;
        if (input.substr(pos, 2) === "\r\n") {
          result0 = "\r\n";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\r\\n\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 10) {
            result0 = "\n";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\n\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 13) {
              result0 = "\r";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\r\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 8232) {
                result0 = "\u2028";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\u2028\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 8233) {
                  result0 = "\u2029";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"\\u2029\"");
                  }
                }
              }
            }
          }
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("end of line");
        }
        return result0;
      }
      
      function parse_sourceChar() {
        var result0;
        
        if (input.length > pos) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("any character");
          }
        }
        return result0;
      }
      
      function parse_comment() {
        var result0;
        
        result0 = parse_multiLineComment();
        if (result0 === null) {
          result0 = parse_singleLineComment();
        }
        return result0;
      }
      
      function parse_singleLineCommentStart() {
        var result0;
        
        if (input.substr(pos, 2) === "//") {
          result0 = "//";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"//\"");
          }
        }
        return result0;
      }
      
      function parse_singleLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2, pos3;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_singleLineCommentStart();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          pos3 = pos;
          reportFailures++;
          result2 = parse_lineTermChar();
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos3;
          }
          if (result2 !== null) {
            result3 = parse_sourceChar();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            pos3 = pos;
            reportFailures++;
            result2 = parse_lineTermChar();
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos3;
            }
            if (result2 !== null) {
              result3 = parse_sourceChar();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result2 = parse_lineTerm();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { 
            return {comment: chars.join('')}; 
          })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_multiLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2, pos3;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 2) === "/*") {
          result0 = "/*";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/*\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          pos3 = pos;
          reportFailures++;
          if (input.substr(pos, 2) === "*/") {
            result2 = "*/";
            pos += 2;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\"*/\"");
            }
          }
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos3;
          }
          if (result2 !== null) {
            result3 = parse_sourceChar();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            pos3 = pos;
            reportFailures++;
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos3;
            }
            if (result2 !== null) {
              result3 = parse_sourceChar();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return {comment: chars.join('')}; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      
      function leftAssociative (lhs, rest) {
        if (rest.length == 0) {
          return lhs;
        }
        
        
        
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
      
      
      
      var result = parseFunctions[startRule]();
      
      
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    
    toSource: function() { return this._source; }
  };
  
  
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();

  return module.exports;
})({exports: {}});
// src/binding
var ___SRC_BINDING___ = (function(module) {
  (function() {
  var AttrBinding, BindingFactory, ClassBinding, EventBinding, KeyupBinding, TextBinding,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BindingFactory = (function() {

    BindingFactory.bindingTypes = {};

    BindingFactory.register = function(type, bindingCtor) {
      if (this.bindingTypes.hasOwnProperty(type)) {
        throw new Error("BindingFactory:duplicate_binding_type: " + type);
      }
      return this.bindingTypes[type] = bindingCtor;
    };

    BindingFactory.make = function(type, prop, depends, callback, runtime) {
      if (!(this.bindingTypes.hasOwnProperty(type))) {
        throw new Error("BindingFactory:unknown_binding_type: " + type);
      }
      return new this(this.bindingTypes[type], prop, depends, callback, runtime);
    };

    function BindingFactory(type, prop, depends, callback, runtime) {
      this.type = type;
      this.prop = prop;
      this.depends = depends;
      this.callback = callback;
      this.runtime = runtime;
    }

    BindingFactory.prototype.destroy = function() {
      delete this.runtime;
      return delete this.callback;
    };

    BindingFactory.prototype.make = function(context, element) {
      return new this.type(context, element, this.prop, this.depends, this.runtime, this.callback);
    };

    return BindingFactory;

  })();

  EventBinding = (function() {

    function EventBinding(context, element, prop, depends, runtime, callback) {
      this.context = context;
      this.element = element;
      this.prop = prop;
      this.depends = depends;
      this.runtime = runtime;
      this.callback = callback;
      this.uponRefresh = __bind(this.uponRefresh, this);

      this.eventRefresh = __bind(this.eventRefresh, this);

      this.refresh = __bind(this.refresh, this);

      this.bindElement(this.element);
    }

    EventBinding.prototype.destroy = function() {
      delete this.context;
      delete this.element;
      delete this.runtime;
      return delete this.callback;
    };

    EventBinding.prototype.rebind = function(context) {
      this.context = context;
    };

    EventBinding.prototype.bindElement = function(element) {
      this.element = element;
      return this.runtime.$(this.element).bind(this.prop, this.eventRefresh);
    };

    EventBinding.prototype.unbindElement = function(element) {
      this.element = element;
      return this.runtime.$(this.element).unbind(this.prop, this.eventRefresh);
    };

    EventBinding.prototype.refresh = function(evt) {};

    EventBinding.prototype.eventRefresh = function(evt) {
      console.log("" + this.constructor.name + ".refresh", evt);
      return this.callback.call({
        runtime: this.runtime,
        element: this.element,
        context: this.context,
        evt: evt
      }, this.uponRefresh);
    };

    EventBinding.prototype.uponRefresh = function(err, res) {};

    return EventBinding;

  })();

  BindingFactory.register('on', EventBinding);

  KeyupBinding = (function(_super) {

    __extends(KeyupBinding, _super);

    function KeyupBinding() {
      return KeyupBinding.__super__.constructor.apply(this, arguments);
    }

    KeyupBinding.prototype.bindElement = function(element) {
      this.element = element;
      return this.runtime.$(this.element).bind('keyup', this.prop, this.refresh);
    };

    KeyupBinding.prototype.unbindElement = function(element) {
      this.element = element;
      return this.runtime.$(this.element).unbind('keyup', this.prop, this.refresh);
    };

    return KeyupBinding;

  })(EventBinding);

  BindingFactory.register('keyup', KeyupBinding);

  TextBinding = (function() {

    function TextBinding(context, element, prop, depends, runtime, callback) {
      this.context = context;
      this.element = element;
      this.prop = prop;
      this.depends = depends;
      this.runtime = runtime;
      this.callback = callback;
      this.flattenVal = __bind(this.flattenVal, this);

      this.uponRefresh = __bind(this.uponRefresh, this);

      this.onMove = __bind(this.onMove, this);

      this.refresh = __bind(this.refresh, this);

      this.proxies = {};
      this.bindProxies(this.context);
    }

    TextBinding.prototype.destroy = function() {
      delete this.context;
      this.unbindProxies();
      delete this.runtime;
      return delete this.element;
    };

    TextBinding.prototype.rebind = function(context) {
      this.bindProxies(context);
      return this.refresh({});
    };

    TextBinding.prototype.bindProxies = function(context) {
      var key, val, _ref, _results;
      this.context = context;
      this.unbindProxies();
      _ref = this.depends;
      _results = [];
      for (key in _ref) {
        val = _ref[key];
        _results.push(this.bindProxy(this.context.getProxy(key)));
      }
      return _results;
    };

    TextBinding.prototype.unbindProxies = function() {
      var key, proxy, _ref, _results;
      _ref = this.proxies;
      _results = [];
      for (key in _ref) {
        proxy = _ref[key];
        _results.push(this.unbindProxy(proxy));
      }
      return _results;
    };

    TextBinding.prototype.bindProxy = function(proxy) {
      proxy.on('set', this.refresh);
      proxy.on('delete', this.refresh);
      proxy.on('move', this.onMove);
      return this.proxies[proxy.prefix] = proxy;
    };

    TextBinding.prototype.unbindProxy = function(proxy) {
      proxy.removeListener('set', this.refresh);
      proxy.removeListener('delete', this.refresh);
      proxy.removeListener('move', this.onMove);
      return delete this.proxies[proxy.prefix];
    };

    TextBinding.prototype.refresh = function(evt) {
      return this.callback.call({
        runtime: this.runtime,
        element: this.element,
        context: this.context,
        evt: evt
      }, this.uponRefresh);
    };

    TextBinding.prototype.onMove = function(_arg) {
      var path, toPath, toProxy;
      path = _arg.path, toPath = _arg.toPath, toProxy = _arg.toProxy;
      console.log('TextBinding.onMove', path, toPath);
      if (this.proxies[path]) {
        this.unbindProxy(this.proxies[path]);
        return this.bindProxy(toProxy);
      }
    };

    TextBinding.prototype.uponRefresh = function(err, res) {
      if (!err) {
        if (this.element instanceof HTMLTitleElement) {
          return this.runtime.$(this.element.ownerDocument).attr('title', this.flattenVal(res));
        } else {
          return this.runtime.$(this.element).html(this.flattenVal(res));
        }
      }
    };

    TextBinding.prototype.flattenVal = function(res) {
      if (res instanceof Object) {
        return JSON.stringify(res);
      } else {
        return res;
      }
    };

    return TextBinding;

  })();

  BindingFactory.register('text', TextBinding);

  AttrBinding = (function(_super) {

    __extends(AttrBinding, _super);

    function AttrBinding() {
      this.uponRefresh = __bind(this.uponRefresh, this);
      return AttrBinding.__super__.constructor.apply(this, arguments);
    }

    AttrBinding.prototype.uponRefresh = function(err, res) {
      if (!err) {
        if (this.prop === 'style') {
          return this.runtime.$(this.element).css(res);
        } else {
          return this.runtime.$(this.element).attr(this.prop, this.flattenVal(res));
        }
      }
    };

    return AttrBinding;

  })(TextBinding);

  BindingFactory.register('attr', AttrBinding);

  ClassBinding = (function(_super) {

    __extends(ClassBinding, _super);

    function ClassBinding() {
      this.uponRefresh = __bind(this.uponRefresh, this);
      return ClassBinding.__super__.constructor.apply(this, arguments);
    }

    ClassBinding.prototype.uponRefresh = function(err, res) {
      if (res) {
        return this.runtime.$(this.element).addClass(this.prop);
      } else {
        return this.runtime.$(this.element).removeClass(this.prop);
      }
    };

    return ClassBinding;

  })(TextBinding);

  BindingFactory.register('class', ClassBinding);

  module.exports = BindingFactory;

}).call(this);

  return module.exports;
})({exports: {}});
// src/each
var ___SRC_EACH___ = (function(module) {
  



(function() {
  var EachUIView, EachUIViewFactory,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EachUIViewFactory = (function() {

    function EachUIViewFactory(contextPath, templateName, runtime) {
      this.contextPath = contextPath;
      this.templateName = templateName;
      this.runtime = runtime;
      this.$ = this.runtime.$;
    }

    EachUIViewFactory.prototype.destroy = function() {
      delete this.runtime;
      return delete this.$;
    };

    EachUIViewFactory.prototype.make = function(context, element) {
      var child, children, newParent, template;
      if (!this.template) {
        if (!this.templateName) {
          template = this.$(element).children().length > 1 ? (newParent = this.$('<div></div>', element.ownerDocument)[0], children = this.$(element).children().appendTo(newParent), newParent) : (child = this.$(element).children()[0], this.$(child).detach(), child);
          this.template = this.runtime.factory.makeTemplateByElement(template);
        } else {
          this.template = this.runtime.factory.get(this.templateName);
        }
      }
      return new EachUIView(context.getProxy(this.contextPath), element, this.contextPath, this.template, this.runtime);
    };

    return EachUIViewFactory;

  })();

  EachUIView = (function() {

    function EachUIView(context, element, prop, template, runtime) {
      this.context = context;
      this.element = element;
      this.prop = prop;
      this.template = template;
      this.runtime = runtime;
      this.onSplice = __bind(this.onSplice, this);

      this.onDelete = __bind(this.onDelete, this);

      this.onSet = __bind(this.onSet, this);

      this.onMove = __bind(this.onMove, this);

      this.children = [];
      this.bindProxy(this.context);
      $(this.element).empty();
    }

    EachUIView.prototype.rebind = function(context) {
      var i, template, _i, _len, _ref, _results;
      this.unbindProxy(context);
      this.bindProxy(context);
      _ref = this.children;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        template = _ref[i];
        _results.push(template.rebind(this.context.getProxy(i)));
      }
      return _results;
    };

    EachUIView.prototype.bindProxy = function(proxy) {
      proxy.on('set', this.onSet);
      proxy.on('delete', this.onDelete);
      proxy.on('move', this.onMove);
      proxy.on('splice', this.onSplice);
      return this.context = proxy;
    };

    EachUIView.prototype.unbindProxy = function(proxy) {
      proxy.removeListener('set', this.onSet);
      proxy.removeListener('delete', this.onDelete);
      proxy.removeListener('move', this.onMove);
      proxy.removeListener('splice', this.onSplice);
      return this.context = null;
    };

    EachUIView.prototype.onMove = function(evt) {
      var path, toPath, toProxy;
      path = evt.path, toPath = evt.toPath, toProxy = evt.toProxy;
      console.log('EachUIView.move', path, toPath, toProxy, this.element);
      this.unbindProxy(this.context);
      return this.bindProxy(toProxy);
    };

    EachUIView.prototype.destroy = function() {
      var child, _i, _len, _ref;
      delete this.$;
      delete this.runtime;
      delete this.template;
      this.unbindProxy(this.context);
      delete this.context;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.destroy();
      }
      return delete this.element;
    };

    EachUIView.prototype.spliceRefresh = function(_arg) {
      var i, index, inserted, insertedLength, removed, removedLength, shiftDiff, _i, _j, _ref, _ref1, _ref2, _ref3, _results, _results1;
      index = _arg.index, removed = _arg.removed, inserted = _arg.inserted;
      console.log('EachUIView.spliceRefresh', index, removed, inserted);
      insertedLength = (inserted != null ? inserted.length : void 0) || 0;
      removedLength = (removed != null ? removed.length : void 0) || 0;
      shiftDiff = insertedLength - removedLength;
      if (shiftDiff > 0) {
        _results = [];
        for (i = _i = _ref = index + removedLength, _ref1 = index + insertedLength; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          _results.push(this.addItem(i));
        }
        return _results;
      } else if (shiftDiff < 0) {
        _results1 = [];
        for (i = _j = _ref2 = index + removedLength - 1, _ref3 = index + insertedLength - 1; _j > _ref3; i = _j += -1) {
          _results1.push(this.removeItem(i));
        }
        return _results1;
      }
    };

    EachUIView.prototype.refresh = function(evt) {
      var values;
      values = this.context.get('.');
      if (!(values instanceof Array)) {

      } else {
        return this.spliceRefresh({
          index: 0,
          removed: 0,
          inserted: values
        });
      }
    };

    EachUIView.prototype.onSet = function(evt) {
      return this.spliceRefresh({
        index: 0,
        removed: evt.oldVal,
        inserted: evt.newVal
      });
    };

    EachUIView.prototype.onDelete = function(evt) {
      return this.spliceRefresh({
        index: 0,
        removed: evt.oldVal,
        inserted: []
      });
    };

    EachUIView.prototype.onSplice = function(evt) {
      return this.spliceRefresh(evt);
    };

    EachUIView.prototype.addItem = function(i) {
      var prev, template;
      template = this.template.make(this.context.getProxy(i));
      if (i === 0) {
        template.prependTo(this.element);
        this.children.unshift(template);
      } else {
        prev = this.children[i - 1];
        if (!prev) {
          throw new Error("EachUIView.gap_in_children: " + i);
        }
        template.appendAfter(prev);
        this.children.splice(i, 0, template);
      }
      return template.refresh({});
    };

    EachUIView.prototype.removeItem = function(i) {
      var template;
      console.log('EachUIView.removeItem', i);
      template = this.children[i];
      if (!template) {
        throw new Error("EachUIView.removeItem:already_removed: " + i);
      }
      template.destroy();
      return this.children.splice(i, 1);
    };

    return EachUIView;

  })();

  module.exports = EachUIViewFactory;

}).call(this);

  return module.exports;
})({exports: {}});
// src/widget
var ___SRC_WIDGET___ = (function(module) {
  (function() {
  var BindingFactory, WidgetFactory,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BindingFactory = ___SRC_BINDING___;

  WidgetFactory = (function() {

    WidgetFactory.widgets = {};

    WidgetFactory.register = function(name, widget) {
      if (this.widgets.hasOwnProperty(name)) {
        throw new Exception({
          error: 'widget_already_defined',
          value: name
        });
      } else {
        return this.widgets[name] = widget;
      }
    };

    function WidgetFactory(context, element, prop, depends, runtime, callback) {
      this.context = context;
      this.element = element;
      this.prop = prop;
      this.depends = depends;
      this.runtime = runtime;
      this.callback = callback;
      this.refresh = __bind(this.refresh, this);

      if (!this.constructor.widgets.hasOwnProperty(this.prop)) {
        throw new Exception({
          error: 'unknown_widget_type',
          value: this.prop
        });
      }
    }

    WidgetFactory.prototype.destroy = function() {
      var _ref;
      if ((_ref = this.widget) != null) {
        _ref.destroy();
      }
      delete this.context;
      delete this.runtime;
      return delete this.element;
    };

    WidgetFactory.prototype.refresh = function(evt) {
      var _this = this;
      if (!this.widget) {
        return this.callback.call({
          runtime: this.runtime,
          element: this.element,
          context: this.context,
          evt: evt
        }, function(err, res) {
          return _this.widget = new _this.constructor.widgets[_this.prop](_this.element, _this.runtime, res);
        });
      }
    };

    return WidgetFactory;

  })();

  BindingFactory.register('widget', WidgetFactory);

  module.exports = WidgetFactory;

}).call(this);

  return module.exports;
})({exports: {}});
// src/compiler
var ___SRC_COMPILER___ = (function(module) {
  (function() {
  var BindingFactory, Compiler, EachBinding, LineBuffer, Parser, WidgetFactory, anfToCPS, deepEqual, expToANF;

  Parser = ___SRC_COVALENT___;

  BindingFactory = ___SRC_BINDING___;

  EachBinding = ___SRC_EACH___;

  WidgetFactory = ___SRC_WIDGET___;

  


  deepEqual = function(o1, o2) {
    var both, left;
    left = function(o1, o2) {
      var key, val;
      for (key in o1) {
        val = o1[key];
        if (!o2.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };
    both = function(o1, o2) {
      var key, val;
      for (key in o1) {
        val = o1[key];
        if (!deepEqual(o1[key], o2[key])) {
          return false;
        }
      }
      return true;
    };
    if (o1 === o2) {
      return true;
    } else if (o1 instanceof Object && o2 instanceof Object) {
      return left(o1, o2) && left(o2, o1) && both(o1, o2);
    } else {
      return false;
    }
  };

  


  expToANF = function(exp) {
    var anfBlock, anfExp, anfFuncall, anfIf, anfInner, anfObject, anfOp, gensym, symTable;
    symTable = {};
    gensym = function(sym) {
      if (sym == null) {
        sym = "arg";
      }
      if (!symTable.hasOwnProperty(sym)) {
        symTable[sym] = 1;
      }
      return {
        id: "" + sym + (symTable[sym]++)
      };
    };
    anfOp = function(_arg, stack) {
      var lhs, lhsRes, op, rhs, rhsRes;
      op = _arg.op, lhs = _arg.lhs, rhs = _arg.rhs;
      lhsRes = anfExp(lhs, stack);
      rhsRes = anfExp(rhs, stack);
      return {
        op: op,
        lhs: lhsRes,
        rhs: rhsRes
      };
    };
    anfFuncall = function(_arg, stack) {
      var arg, args, err, func, funcall, res, resArgs;
      funcall = _arg.funcall, args = _arg.args;
      func = anfExp(funcall, stack);
      resArgs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(anfExp(arg, stack));
        }
        return _results;
      })();
      err = gensym("err");
      res = gensym("res");
      stack.push({
        anf: res,
        err: err,
        funcall: func,
        args: resArgs
      });
      return res;
    };
    anfIf = function(exp, stack) {
      var err, res, resExp;
      resExp = {
        "if": anfExp(exp["if"], stack),
        then: anfInner(exp.then),
        "else": anfInner(exp["else"])
      };
      if (deepEqual(exp, resExp)) {
        return exp;
      } else {
        err = gensym("err");
        res = gensym("res");
        stack.push({
          anf: res,
          "if": resExp["if"],
          then: resExp.then,
          "else": resExp["else"],
          err: err
        });
        return res;
      }
    };
    anfBlock = function(_arg, stack) {
      var block, i, _i, _ref;
      block = _arg.block;
      for (i = _i = 0, _ref = block.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        anfExp(block[i], stack);
      }
      return anfExp(block[block.length - 1], stack);
    };
    anfObject = function(_arg, stack) {
      var key, newKeyVals, object, res, val;
      object = _arg.object;
      newKeyVals = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = object.length; _i < _len; _i++) {
          _ref = object[_i], key = _ref[0], val = _ref[1];
          res = anfExp(val, stack);
          _results.push([key, res]);
        }
        return _results;
      })();
      return {
        object: newKeyVals
      };
    };
    anfExp = function(exp, stack) {
      if (stack == null) {
        stack = [];
      }
      if (!(exp instanceof Object)) {
        return exp;
      } else if (exp.block) {
        return anfBlock(exp, stack);
      } else if (exp.op) {
        return anfOp(exp, stack);
      } else if (exp["if"]) {
        return anfIf(exp, stack);
      } else if (exp.funcall) {
        return anfFuncall(exp, stack);
      } else if (exp.object) {
        return anfObject(exp, stack);
      } else {
        return exp;
      }
    };
    anfInner = function(exp) {
      var last, stack;
      stack = [];
      last = anfExp(exp, stack);
      stack.push(last);
      return stack;
    };
    return anfInner(exp);
  };

  


  anfToCPS = function(stack) {
    var blockAddContinuationThenCPS, cps, cpsInner, lastResFromBlock, res, stackAddContinuation, swapCpsID;
    swapCpsID = function(exp, from, to) {
      var arg;
      if (!(exp instanceof Object)) {
        return exp;
      } else if (exp.id) {
        if (exp.id === from.id) {
          return to;
        } else {
          return exp;
        }
      } else if (exp.op) {
        return {
          op: exp.op,
          lhs: swapCpsID(exp.lhs, from, to),
          rhs: swapCpsID(exp.rhs, from, to)
        };
      } else if (exp.funcall) {
        return {
          funcall: swapCpsID(exp.funcall, from, to),
          args: (function() {
            var _i, _len, _ref, _results;
            _ref = exp.args;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              _results.push(swapCpsID(arg, from, to));
            }
            return _results;
          })()
        };
      } else if (exp.block) {
        return {
          block: (function() {
            var _i, _len, _ref, _results;
            _ref = exp.block;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              exp = _ref[_i];
              _results.push(swapCpsID(exp, from, to));
            }
            return _results;
          })()
        };
      } else if (exp["if"]) {
        return {
          "if": swapCpsID(exp["if"], from, to),
          then: swapCpsID(exp.then, from, to),
          "else": swapCpsID(exp["else"], from, to)
        };
      } else {
        throw new Error("swapCpsID:unknown_exp: " + (JSON.stringify(exp, null, 2)));
      }
    };
    lastResFromBlock = function(stack) {
      var exp, i, _i, _ref;
      for (i = _i = _ref = stack.length - 1; _i >= 0; i = _i += -1) {
        exp = stack[i];
        if (exp.anf) {
          return exp.anf;
        }
      }
    };
    stackAddContinuation = function(stack, cont, res) {
      var lastExp, newStack;
      newStack = [].concat(stack);
      lastExp = newStack[newStack.length - 1];
      if ((lastExp != null ? lastExp.id : void 0) === res.id) {
        newStack.pop();
      }
      newStack.push(cont);
      return newStack;
    };
    blockAddContinuationThenCPS = function(stack, cont, anfRes) {
      var newContinuation, newStack, stackAnf;
      stackAnf = lastResFromBlock(stack);
      newContinuation = swapCpsID(cont, anfRes, stackAnf);
      newStack = stackAddContinuation(stack, newContinuation, stackAnf);
      return anfToCPS(newStack);
    };
    cpsInner = function(stack, i, resExp) {
      var callback, elseExp, err, exp, thenExp;
      if (i < 0) {
        return resExp;
      }
      exp = stack[i];
      if (!(exp instanceof Object)) {
        if (resExp.block) {
          resExp.block.unshift(exp);
        } else {
          resExp = {
            block: [exp, resExp]
          };
        }
        return cpsInner(stack, i - 1, resExp);
      } else if (exp.anf) {
        err = exp.err;
        if (exp.funcall) {
          if ((resExp != null ? resExp.id : void 0) === exp.anf.id) {
            return cpsInner(stack, i - 1, {
              funcall: exp.funcall,
              args: exp.args.concat([
                {
                  id: 'cb'
                }
              ]),
              cps: true
            });
          } else {
            callback = {
              "function": '',
              args: [exp.err.id, exp.anf.id],
              body: [
                {
                  "if": err,
                  then: {
                    funcall: {
                      id: 'cb'
                    },
                    args: [err]
                  },
                  "else": resExp.funcall ? resExp : {
                    funcall: {
                      id: 'cb'
                    },
                    args: [null, resExp]
                  },
                  cps: true
                }
              ]
            };
            return cpsInner(stack, i - 1, {
              funcall: exp.funcall,
              args: exp.args.concat([callback]),
              cps: true
            });
          }
        } else if (exp["if"]) {
          thenExp = blockAddContinuationThenCPS(exp.then, resExp, exp.anf);
          elseExp = blockAddContinuationThenCPS(exp["else"], resExp, exp.anf);
          return cpsInner(stack, i - 1, {
            "if": exp["if"],
            then: thenExp,
            "else": elseExp,
            cps: true
          });
        } else {
          throw new Error("unknown_anf_form: " + (JSON.stringify(exp, null, 2)));
        }
      } else {
        if (resExp.block) {
          resExp.block.unshift(exp);
        } else {
          resExp = {
            block: [exp, resExp]
          };
        }
        return cpsInner(stack, i - 1, resExp);
      }
    };
    cps = function(stack) {
      return cpsInner(stack, stack.length - 2, stack[stack.length - 1]);
    };
    res = cps(stack);
    if (!(res instanceof Object)) {
      return {
        funcall: {
          id: 'cb'
        },
        args: [null, res]
      };
    } else if (res.cps) {
      return res;
    } else {
      return {
        funcall: {
          id: 'cb'
        },
        args: [null, res]
      };
    }
  };

  LineBuffer = (function() {

    function LineBuffer(level) {
      this.level = level != null ? level : 0;
      this.tab = '  ';
      this.current = [this.level, ''];
      this.lines = [this.current];
    }

    LineBuffer.prototype.incLevel = function() {};

    LineBuffer.prototype.decLevel = function() {};

    LineBuffer.prototype.write = function(str) {
      var i, lines, _i, _ref, _results;
      lines = str.split(/(\r|\n|\r\n)/);
      this.append(lines[0]);
      _results = [];
      for (i = _i = 1, _ref = lines.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.newLine();
        _results.push(this.append(lines[i]));
      }
      return _results;
    };

    LineBuffer.prototype.writeLine = function(str) {
      this.write(str);
      return this.newLine();
    };

    LineBuffer.prototype.newLine = function() {
      this.current = [this.level, ''];
      return this.lines.push(this.current);
    };

    LineBuffer.prototype.indent = function() {
      this.level++;
      return this.current[0] = this.level;
    };

    LineBuffer.prototype.dedent = function() {
      this.level--;
      return this.current[0] = this.level;
    };

    LineBuffer.prototype.append = function(text) {
      return this.current[1] += text;
    };

    LineBuffer.prototype.toString = function() {
      var line;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.lines;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          _results.push(this.toLine(line));
        }
        return _results;
      }).call(this)).join("\n");
    };

    LineBuffer.prototype.toLine = function(_arg) {
      var i, level, line;
      level = _arg[0], line = _arg[1];
      return ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= level ? _i < level : _i > level; i = 0 <= level ? ++_i : --_i) {
          _results.push(this.tab);
        }
        return _results;
      }).call(this)).join('') + line;
    };

    return LineBuffer;

  })();

  Compiler = (function() {

    function Compiler(runtime) {
      this.runtime = runtime;
    }

    Compiler.prototype.destroy = function() {
      return delete this.runtime;
    };

    Compiler.prototype.parse = function(stmt) {
      return Parser.parse(stmt);
    };

    Compiler.prototype.parseGen = function(stmt) {
      return this.generate(this.parse(stmt));
    };

    Compiler.prototype.compile = function(stmt) {
      var depends, exp;
      depends = {};
      exp = this.parse(stmt);
      if (exp.bindings) {
        return this.compileBindings(exp);
      } else {
        return this.compileExp(exp);
      }
    };

    Compiler.prototype.compileBindings = function(exp, bindingList) {
      var binding, i, _i, _len, _ref;
      if (bindingList == null) {
        bindingList = [];
      }
      _ref = exp.bindings;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        binding = _ref[i];
        if (binding.at) {
          this.compileAtRuleBinding(binding, bindingList);
        } else if (binding.each) {
          this.compileEachBinding(binding, bindingList);
        } else {
          throw new Error("binding_not_supported_yet: " + (JSON.stringify(binding)));
        }
      }
      return bindingList;
    };

    Compiler.prototype.compileEachBinding = function(_arg, bindingList) {
      var binding, each, template;
      each = _arg.each, template = _arg.template;
      if (bindingList == null) {
        bindingList = [];
      }
      binding = new EachBinding(each, template, this.runtime);
      return bindingList.push(binding);
    };

    Compiler.prototype.compileAtRuleBinding = function(_arg, bindingList) {
      var at, bindingExp, bindings, callback, depends, exp, i, prop, _i, _len, _ref, _results;
      at = _arg.at, bindings = _arg.bindings;
      if (bindingList == null) {
        bindingList = [];
      }
      _results = [];
      for (i = _i = 0, _len = bindings.length; _i < _len; i = ++_i) {
        _ref = bindings[i], prop = _ref.prop, exp = _ref.exp;
        depends = {};
        callback = this.compileExp(exp, depends);
        bindingExp = BindingFactory.make(at, prop, depends, callback, this.runtime);
        _results.push(bindingList.push(bindingExp));
      }
      return _results;
    };

    Compiler.prototype.newEnvironment = function(current, prev) {
      var key, newEnv, val;
      newEnv = Object.create(prev);
      for (key in current) {
        val = current[key];
        if (current.hasOwnProperty(key)) {
          newEnv[key] = val;
        }
      }
      return newEnv;
    };

    Compiler.prototype.compileExp = function(exp, depends) {
      var anf, compiled, cps;
      if (depends == null) {
        depends = {};
      }
      anf = this.expToANF(exp);
      cps = this.anfToCPS(anf);
      compiled = this.cpsToSource(cps, depends);
      console.log('Compiler.compileExp', compiled);
      return new Function(['cb'], "var self = this;\n" + compiled);
    };

    Compiler.prototype.expToANF = expToANF;

    Compiler.prototype.anfToCPS = anfToCPS;

    Compiler.prototype.cpsToSource = function(exp, depends) {
      var newEnv;
      if (depends == null) {
        depends = {};
      }
      newEnv = this.newEnvironment({
        cb: {
          id: 'cb'
        }
      }, this.runtime.env);
      return this.generate(exp, newEnv, 3, depends);
    };

    Compiler.prototype.generate = function(exp, env, level, depends, isLast) {
      var buffer;
      if (isLast == null) {
        isLast = false;
      }
      buffer = new LineBuffer(level);
      this.gen(exp, env, buffer, depends, isLast);
      return buffer.toString();
    };

    Compiler.prototype.gen = function(exp, env, buffer, depends, isLast) {
      if (!(exp instanceof Object)) {
        return this.genLiteral(exp, env, buffer, depends, isLast);
      } else if (exp.op) {
        return this.genOp(exp, env, buffer, depends, isLast);
      } else if (exp.funcall) {
        return this.genFuncall(exp, env, buffer, depends, isLast);
      } else if (exp.id) {
        return this.genID(exp, env, buffer, depends, isLast);
      } else if (exp.cell) {
        return this.genCell(exp, env, buffer, depends, isLast);
      } else if (exp.cellSet) {
        return this.genCellSet(exp, env, buffer, depends, isLast);
      } else if (exp.cellAlias) {
        return this.genCellAlias(exp, env, buffer, depends, isLast);
      } else if (exp["if"]) {
        return this.genIf(exp, env, buffer, depends, isLast);
      } else if (exp.element) {
        return this.genElement(exp, env, buffer, depends, isLast);
      } else if (exp.object) {
        return this.genObject(exp, env, buffer, depends, isLast);
      } else if (exp.hasOwnProperty('function')) {
        return this.genFunction(exp, env, buffer, depends, isLast);
      } else {
        throw new Error("Compiler.generate:unsupported_exp: " + (JSON.stringify(exp)));
      }
    };

    Compiler.prototype.genLiteral = function(exp, env, buffer, depends, isLast) {
      var str;
      if (typeof exp !== 'string') {
        return buffer.append(exp);
      }
      str = exp.replace(/"/g, "\\\"").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
      return buffer.append("\"" + str + "\"");
    };

    Compiler.prototype.genOp = function(_arg, env, buffer, depends, isLast) {
      var lhs, op, rhs;
      op = _arg.op, lhs = _arg.lhs, rhs = _arg.rhs;
      if (op === '!') {
        buffer.write('!');
        return this.gen(lhs, env, buffer, depends, false);
      } else {
        this.gen(lhs, env, buffer, depends, false);
        buffer.write(" " + op + " ");
        return this.gen(rhs, env, buffer, depends, false);
      }
    };

    Compiler.prototype.genFuncall = function(_arg, env, buffer, depends, isLast) {
      var arg, args, funcall, i, _i, _len;
      funcall = _arg.funcall, args = _arg.args;
      this.gen(funcall, env, buffer, depends, false);
      buffer.write(".call(self, ");
      for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
        arg = args[i];
        this.gen(arg, env, buffer, depends, false);
        if (i !== args.length - 1) {
          buffer.write(", ");
        }
      }
      return buffer.write(")");
    };

    Compiler.prototype.genFunction = function(exp, env, buffer, depends, isLast) {
      var arg, args, body, i, lastExp, newArgs, newEnv, _i, _j, _len, _ref;
      args = exp.args, body = exp.body;
      newArgs = {};
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        newArgs[arg] = {
          id: arg
        };
      }
      newEnv = this.newEnvironment(newArgs, env);
      buffer.write("function " + exp["function"] + "(");
      buffer.write(args.join(", "));
      buffer.write(") {");
      buffer.newLine();
      buffer.indent();
      for (i = _j = 0, _ref = body.length - 1; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
        this.gen(body[i], newEnv, buffer, depends, false);
        buffer.write(";");
        buffer.newLine();
      }
      lastExp = body[body.length - 1];
      if (lastExp["if"]) {
        this.gen(lastExp, newEnv, buffer, depends, true);
      } else {
        buffer.write("return ");
        this.gen(lastExp, newEnv, buffer, depends, false);
        buffer.write(";");
      }
      buffer.newLine();
      buffer.dedent();
      return buffer.write("}");
    };

    Compiler.prototype.genID = function(_arg, env, buffer, depends, isLast) {
      var id;
      id = _arg.id;
      if (env.hasOwnProperty(id)) {
        return buffer.write(id);
      } else if (this.runtime.env.hasOwnProperty(id)) {
        buffer.write("self.runtime.env['");
        buffer.write(id);
        return buffer.write("']");
      } else if (env[id]) {
        return buffer.write(id);
      } else {
        throw new Error("Compiler.compile:unknown_id: " + id);
      }
    };

    Compiler.prototype.genCell = function(_arg, env, buffer, depends, isLast) {
      var cell;
      cell = _arg.cell;
      depends[cell] = cell;
      return buffer.write("self.context.get(\"" + cell + "\")");
    };

    Compiler.prototype.genCellSet = function(_arg, env, buffer, depends, isLast) {
      var cellSet, exp;
      cellSet = _arg.cellSet, exp = _arg.exp;
      buffer.write("self.context.set(\"" + cellSet + "\", ");
      this.gen(exp, env, buffer, depends);
      return buffer.write(")");
    };

    Compiler.prototype.genCellAlias = function(_arg, env, buffer, depends, isLast) {
      var cellAlias, exp;
      cellAlias = _arg.cellAlias, exp = _arg.exp;
      depends[exp] = exp;
      return buffer.write("self.context.setAlias(\"" + cellAlias + "\", \"" + exp + "\")");
    };

    Compiler.prototype.genIf = function(exp, env, buffer, depends, isLast) {
      if (!exp.cps) {
        buffer.writeLine("(function() {");
        buffer.indent();
      }
      buffer.write("if (");
      this.gen(exp["if"], env, buffer, depends, false);
      buffer.writeLine(") {");
      buffer.indent();
      if ((!exp.cps) || isLast) {
        buffer.write("return ");
      }
      this.gen(exp.then, env, buffer, depends, false);
      buffer.newLine();
      buffer.dedent();
      buffer.writeLine("} else {");
      buffer.indent();
      if (!exp.cps || isLast) {
        buffer.write("return ");
      }
      this.gen(exp["else"], env, buffer, depends, false);
      buffer.newLine();
      buffer.dedent();
      buffer.writeLine("}");
      if (!exp.cps) {
        buffer.dedent();
        return buffer.writeLine("}).call(this)");
      }
    };

    Compiler.prototype.genElement = function(_arg, env, buffer, depends, isLast) {
      var element, prop;
      element = _arg.element, prop = _arg.prop;
      buffer.write("self.runtime.$(");
      buffer.write("self.element");
      buffer.write(")");
      return buffer.write((function() {
        switch (prop) {
          case "value":
            return ".val()";
          case "html":
            return ".html()";
          case "text":
            return ".text()";
          case "height":
            return ".height()";
          case "width":
            return ".width()";
          case "relLeft":
            return ".position().left";
          case "relTop":
            return ".position().top";
          case "pos":
            return ".position()";
          case "absLeft":
            return ".offset().left";
          case "absTop":
            return ".offset().top";
          case "offset":
            return ".offset()";
          case "index":
            return ".index()";
          case "scrollTop":
            return "[0].scrollTop";
          case "scrollHeight":
            return ".scrollHeight()";
          default:
            throw new Error("Compiler.compile:unknown_element_property: " + prop);
        }
      })());
    };

    Compiler.prototype.genObject = function(_arg, env, buffer, depends, isLast) {
      var exp, i, key, object, _i, _len, _ref;
      object = _arg.object;
      buffer.writeLine("{");
      buffer.indent();
      for (i = _i = 0, _len = object.length; _i < _len; i = ++_i) {
        _ref = object[i], key = _ref[0], exp = _ref[1];
        if (i > 0) {
          buffer.write(", ");
        }
        buffer.write("" + key + ": ");
        this.gen(exp, env, buffer, depends);
        buffer.newLine();
      }
      buffer.dedent();
      return buffer.write("}");
    };

    return Compiler;

  })();

  module.exports = Compiler;

}).call(this);

  return module.exports;
})({exports: {}});
// src/template
var ___SRC_TEMPLATE___ = (function(module) {
  (function() {
  var EachTemplate, Template, TemplateManager, UIView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EachTemplate = ___SRC_EACH___;

  


  Template = (function() {

    Template.make = function(template, runtime, noClone) {
      var element;
      if (noClone == null) {
        noClone = false;
      }
      element = runtime.$(template)[0];
      return new this(element, runtime, noClone);
    };

    function Template(element, runtime, noClone) {
      var binding, bindings, boundElt, eachElt, i, _i, _j, _len, _len1, _ref;
      this.element = element;
      this.runtime = runtime;
      this.noClone = noClone != null ? noClone : false;
      this.$ = this.runtime.$;
      this.bindingFactories = [];
      eachElt = null;
      _ref = this.$(this.element).filter('[data-bind]').add('[data-bind]', this.element).toArray();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        boundElt = _ref[i];
        if (eachElt) {
          if (this.$(eachElt).has(boundElt).length > 0) {
            this.$(boundElt).attr('covalent-inner', true);
            continue;
          } else {
            eachElt = null;
          }
        }
        bindings = this.runtime.compile(this.$(boundElt).data('bind'));
        if (bindings instanceof Array) {
          for (_j = 0, _len1 = bindings.length; _j < _len1; _j++) {
            binding = bindings[_j];
            if (binding instanceof EachTemplate) {
              eachElt = boundElt;
            }
          }
          this.bindingFactories.push(bindings);
        } else {
          throw new Error("Template:parse_binding_unsupported");
        }
      }
    }

    Template.prototype.destroy = function() {
      var factory, _i, _len, _ref, _results;
      if (!this.noClone) {
        this.$(this.element).remove();
      }
      delete this.$element;
      delete this.$;
      delete this.runtime;
      _ref = this.bindingFactories;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        factory = _ref[_i];
        _results.push(factory.destroy());
      }
      return _results;
    };

    Template.prototype.make = function(context) {
      return new UIView(context, this, this.runtime);
    };

    Template.prototype.clone = function() {
      if (this.noClone) {
        return this.element;
      } else {
        return this.$(this.element).clone()[0];
      }
    };

    return Template;

  })();

  UIView = (function() {

    function UIView(context, template, runtime) {
      this.context = context;
      this.template = template;
      this.runtime = runtime;
      this.onMove = __bind(this.onMove, this);

      this.$ = runtime.$;
      this.bindings = [];
      this.element = this.initialize();
      this.children = [];
      this.bindProxy(this.context);
    }

    UIView.prototype.destroy = function() {
      var binding, child, _i, _j, _len, _len1, _ref, _ref1, _results;
      delete this.runtime;
      this.unbindProxy(this.context);
      delete this.context;
      delete this.template;
      this.$(this.element).remove();
      delete this.element;
      delete this.$;
      _ref = this.bindings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        binding.destroy();
      }
      _ref1 = this.children;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        child = _ref1[_j];
        _results.push(child.destroy());
      }
      return _results;
    };

    UIView.prototype.rebind = function(context) {
      var binding, _i, _len, _ref, _results;
      this.unbindProxy();
      this.bindProxy(context);
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.rebind(context));
      }
      return _results;
    };

    UIView.prototype.bindProxy = function(context) {
      this.context = context;
      return this.context.on('move', this.onMove);
    };

    UIView.prototype.unbindProxy = function(context) {
      this.context.removeListener('move', this.onMove);
      return this.context = null;
    };

    UIView.prototype.onMove = function(evt) {
      var path, toPath, toProxy;
      path = evt.path, toPath = evt.toPath, toProxy = evt.toProxy;
      return this.rebind(toProxy);
    };

    UIView.prototype.initialize = function() {
      var bindingFactory, boundElements, i, view, _i, _j, _len, _ref, _ref1;
      view = this.template.clone();
      boundElements = $(view).filter('[data-bind]').add('[data-bind]', view).not('[covalent-inner]').toArray();
      $('[covalent-inner]', view).removeAttr('covalent-inner');
      if (boundElements.length !== this.template.bindingFactories.length) {
        throw new Error("Template.ctor:mismatch_bindings_length");
      }
      for (i = _i = 0, _ref = boundElements.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = this.template.bindingFactories[i];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          bindingFactory = _ref1[_j];
          this.bindings.push(bindingFactory.make(this.context, boundElements[i]));
        }
      }
      return view;
    };

    UIView.prototype.refresh = function(evt) {
      var binding, _i, _len, _ref, _results;
      if (evt == null) {
        evt = {};
      }
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.refresh(evt));
      }
      return _results;
    };

    UIView.prototype.prependTo = function(parent) {
      this.parent = parent;
      return this.$(this.parent).prepend(this.element);
    };

    UIView.prototype.appendTo = function(parent) {
      this.parent = parent;
      return this.$(this.parent).append(this.element);
    };

    UIView.prototype.appendAfter = function(template) {
      return this.$(template.element).after(this.element);
    };

    UIView.prototype.detach = function() {
      if (this.parent) {
        return this.$(this.parent).detach(this.element);
      }
    };

    return UIView;

  })();

  TemplateManager = (function() {

    function TemplateManager(runtime) {
      this.runtime = runtime;
      this.$ = this.runtime.$;
      console.log("TemplateManager.ctor");
      this.templates = {};
      this.instances = {};
    }

    TemplateManager.prototype.destroy = function() {
      var key, template, _ref, _results;
      delete this.$;
      delete this.runtime;
      _ref = this.templates;
      _results = [];
      for (key in _ref) {
        template = _ref[key];
        _results.push(template.destroy());
      }
      return _results;
    };

    TemplateManager.prototype.load = function() {
      var name, script, template, _i, _len, _ref, _results;
      _ref = this.$('script[type="text/template"]').toArray();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        script = _ref[_i];
        name = this.$(script).data('template-name');
        template = Template.make(this.$(script).html(), this.runtime);
        if (this.templates.hasOwnProperty(name)) {
          throw new Error("TemplateManager.duplicate_template_name: " + name);
        }
        _results.push(this.templates[name] = template);
      }
      return _results;
    };

    TemplateManager.prototype.uniqueID = function() {
      if (!this.id) {
        this.id = 1;
      }
      return "__covalent_" + (this.id++);
    };

    TemplateManager.prototype.elementID = function(element) {
      var id;
      id = this.$(element).data('__covalent_id');
      if (!id) {
        id = this.uniqueID();
        this.$(element).data('__covalent_id', id);
      }
      return id;
    };

    TemplateManager.prototype.get = function(name) {
      if (!this.templates.hasOwnProperty(name)) {
        throw new Error("TemplateManager.unknown_template: " + name);
      }
      return this.templates[name];
    };

    TemplateManager.prototype.makeView = function(element, tplName, context) {
      var view;
      if (context == null) {
        context = this.runtime.context.getProxy('.');
      }
      if (!this.templates.hasOwnProperty(tplName)) {
        throw new Error("TemplateManager.unknown_template: " + tplName);
      }
      view = this.templates[tplName].make(context);
      view.appendTo(element);
      return view;
    };

    TemplateManager.prototype.setView = function(element, tplName, context) {
      var view;
      if (context == null) {
        context = this.runtime.context.getProxy('.');
      }
      view = this.makeView(element, tplName, context);
      this.instances[this.elementID(view.element)] = view;
      view.refresh({});
      return view;
    };

    TemplateManager.prototype.makeTemplateByElement = function(element, noClone) {
      var template;
      if (noClone == null) {
        noClone = false;
      }
      template = Template.make(element, this.runtime, noClone);
      this.templates[this.elementID(element)] = template;
      return template;
    };

    TemplateManager.prototype.initializeView = function(element, context) {
      var template, view;
      if (context == null) {
        context = this.runtime.context.getProxy('.');
      }
      template = this.makeTemplateByElement(element, true);
      view = template.make(context);
      this.instances[this.elementID(element)] = view;
      view.refresh({});
      return view;
    };

    return TemplateManager;

  })();

  module.exports = TemplateManager;

}).call(this);

  return module.exports;
})({exports: {}});
// src/object
var ___SRC_OBJECT___ = (function(module) {
  (function() {
  var EventEmitter, ObjectProxy, ProxyAlias, ProxyMap,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  EventEmitter = require('builtin').events.EventEmitter;

  ProxyAlias = (function(_super) {

    __extends(ProxyAlias, _super);

    function ProxyAlias(inner, prefix) {
      this.inner = inner;
      this.prefix = prefix;
    }

    ProxyAlias.prototype._normalizePath = function(path) {
      if (this.prefix === '') {
        return path;
      } else if (path === '.') {
        return this.prefix;
      } else if (typeof path === 'string' && path.indexOf('/') === 0) {
        return path.substring(1);
      } else {
        return [this.prefix, path].join('.');
      }
    };

    ProxyAlias.prototype.get = function(path) {
      return this.inner.get(this._normalizePath(path));
    };

    ProxyAlias.prototype.set = function(path, val) {
      return this.inner.set(this._normalizePath(path), val);
    };

    ProxyAlias.prototype["delete"] = function(path) {
      return this.inner["delete"](this._normalizePath(path));
    };

    ProxyAlias.prototype.splice = function(path, index, removedCount, inserted) {
      return this.inner.splice(this._normalizePath(path), index, removedCount, inserted);
    };

    ProxyAlias.prototype.push = function(path, inserted) {
      return this.inner.push(this._normalizePath(path), inserted);
    };

    ProxyAlias.prototype.pop = function(path) {
      return this.inner.pop(this._normalizePath(path));
    };

    ProxyAlias.prototype.shift = function(path) {
      return this.inner.shift(this._normalizePath(path));
    };

    ProxyAlias.prototype.unshift = function(path, inserted) {
      return this.inner.unshift(this._normalizePath(path), inserted);
    };

    ProxyAlias.prototype.getProxy = function(path) {
      return this.inner.getProxy(this._normalizePath(path));
    };

    ProxyAlias.prototype.hasProxy = function(path) {
      return this.inner.hasProxy(this._normalizePath(path));
    };

    return ProxyAlias;

  })(EventEmitter);

  ProxyMap = (function() {

    function ProxyMap(root) {
      this.root = root;
      this._callMove = __bind(this._callMove, this);

      this._callSplice = __bind(this._callSplice, this);

      this._callDelete = __bind(this._callDelete, this);

      this._callSet = __bind(this._callSet, this);

      this.proxies = {};
      this.root.on('set', this._callSet);
      this.root.on('delete', this._callDelete);
      this.root.on('splice', this._callSplice);
      this.root.on('move', this._callMove);
    }

    ProxyMap.prototype.hasProxy = function(path) {
      if (this.proxies.hasOwnProperty(path)) {
        return this.proxies[path];
      } else {
        return void 0;
      }
    };

    ProxyMap.prototype.getProxy = function(path) {
      var proxy;
      if (path === '.') {
        path = '';
      }
      proxy = this.hasProxy(path);
      if (!proxy) {
        return this.addProxy(path);
      } else {
        return proxy;
      }
    };

    ProxyMap.prototype.addProxy = function(path) {
      var proxy;
      proxy = new ProxyAlias(this.root, path);
      this.proxies[proxy.prefix] = proxy;
      return proxy;
    };

    ProxyMap.prototype.setAlias = function(path, path2) {
      var proxy;
      proxy = this.getProxy(path);
      proxy.prefix = path2;
      return proxy;
    };

    ProxyMap.prototype._inLeft = function(current, val) {
      var k, result, v;
      result = {};
      for (k in current) {
        v = current[k];
        if (current.hasOwnProperty(k) && !val.hasOwnProperty(k)) {
          result[k] = v;
        }
      }
      return result;
    };

    ProxyMap.prototype._modified = function(current, val, left, right) {
      var k, v;
      if (left == null) {
        left = {};
      }
      if (right == null) {
        right = {};
      }
      for (k in current) {
        v = current[k];
        if (current.hasOwnProperty(k) && val.hasOwnProperty(k)) {
          if (v !== val[k]) {
            left[k] = v;
            right[k] = val[k];
          }
        }
      }
      return [left, right];
    };

    ProxyMap.prototype._callSet = function(evt) {
      var proxy;
      proxy = this.hasProxy(evt.path);
      if (proxy) {
        return this._recurseSet(proxy, evt);
      }
    };

    ProxyMap.prototype._recurseSet = function(proxy, evt) {
      var inserted, left, newVal, oldVal, path, removed, right, _ref;
      path = evt.path, oldVal = evt.oldVal, newVal = evt.newVal;
      if ((oldVal instanceof Object) && (newVal instanceof Object)) {
        removed = this._inLeft(oldVal, newVal);
        inserted = this._inLeft(newVal, oldVal);
        _ref = this._modified(oldVal, newVal, {}, inserted), left = _ref[0], right = _ref[1];
        this._recurseDeleteInner(proxy, {
          type: 'delete',
          path: path,
          oldVal: removed
        });
        this._recurseSetInner(proxy, {
          type: 'set',
          path: path,
          oldVal: left,
          newVal: right
        });
      } else if (!(oldVal instanceof Object)) {
        this._recurseSetInner(proxy, {
          type: 'set',
          path: path,
          oldVal: {},
          newVal: newVal
        });
      } else if (!(newVal instanceof Object)) {
        this._recurseDeleteInner(proxy, {
          type: 'delete',
          path: path,
          oldVal: oldVal
        });
      } else {
        null;
      }
      return proxy.emit('set', evt);
    };

    ProxyMap.prototype._recurseSetInner = function(proxy, evt) {
      var innerPath, innerProxy, key, newVal, oldVal, path, val, _results;
      path = evt.path, oldVal = evt.oldVal, newVal = evt.newVal;
      _results = [];
      for (key in newVal) {
        val = newVal[key];
        if (newVal.hasOwnProperty(key)) {
          innerPath = "" + path + "." + key;
          innerProxy = this.hasProxy(innerPath);
          if (innerProxy) {
            _results.push(this._recurseSet(innerProxy, {
              type: 'set',
              path: innerPath,
              oldVal: oldVal[key],
              newVal: val
            }));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ProxyMap.prototype._callDelete = function(evt) {
      var proxy;
      proxy = this.hasProxy(evt.path);
      if (proxy) {
        return this._recurseDelete(proxy, evt);
      }
    };

    ProxyMap.prototype._recurseDelete = function(proxy, evt) {
      this._recurseDeleteInner(proxy, evt);
      return proxy.emit('delete', evt);
    };

    ProxyMap.prototype._recurseDeleteInner = function(proxy, evt) {
      var inner, innerPath, key, oldVal, path, val, _results;
      path = evt.path, oldVal = evt.oldVal;
      if (oldVal instanceof Object) {
        _results = [];
        for (key in oldVal) {
          val = oldVal[key];
          if (oldVal.hasOwnProperty(key)) {
            innerPath = "" + path + "." + key;
            inner = this.hasProxy(innerPath);
            if (inner) {
              _results.push(this._recurseDelete(inner, {
                type: 'delete',
                path: innerPath,
                oldVal: val
              }));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    ProxyMap.prototype._callSplice = function(evt) {
      var proxy;
      proxy = this.hasProxy(evt.path);
      if (proxy) {
        return proxy.emit('splice', evt);
      }
    };

    ProxyMap.prototype._callMove = function(evt) {
      var proxy, toProxy;
      proxy = this.hasProxy(evt.path);
      if (proxy) {
        toProxy = this.getProxy(evt.toPath);
        evt.toProxy = toProxy;
        return proxy.emit('move', evt);
      }
    };

    return ProxyMap;

  })();

  ObjectProxy = (function(_super) {

    __extends(ObjectProxy, _super);

    function ObjectProxy(data) {
      this.data = data;
      this.map = new ProxyMap(this);
    }

    ObjectProxy.prototype._path = function(path) {
      return path.split('.');
    };

    ObjectProxy.prototype._pathWithKey = function(path) {
      var key, segs;
      segs = this._path(path);
      key = segs.pop();
      return [segs, key];
    };

    ObjectProxy.prototype.get = function(path) {
      return this._get(this._path(path), this.data);
    };

    ObjectProxy.prototype.getProxy = function(path) {
      return this.map.getProxy(path);
    };

    ObjectProxy.prototype.hasProxy = function(path) {
      return this.map.hasProxy(path);
    };

    ObjectProxy.prototype._get = function(segs, data) {
      var current, i, seg, _i, _ref;
      current = data;
      for (i = _i = 0, _ref = segs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        seg = segs[i];
        if (current != null ? current.hasOwnProperty(seg) : void 0) {
          current = current[seg];
        } else {
          return void 0;
        }
      }
      return current;
    };

    ObjectProxy.prototype.set = function(path, val) {
      var current, key, segs, _ref;
      _ref = this._pathWithKey(path), segs = _ref[0], key = _ref[1];
      current = this._get(segs, this.data);
      if (current instanceof Object) {
        return this._set(path, current, key, val);
      } else {
        throw new Error("ObjectProxy.set:not_an_object: " + path);
      }
    };

    ObjectProxy.prototype._set = function(path, current, key, val) {
      var oldVal;
      oldVal = current[key];
      current[key] = val;
      return this.emit('set', {
        type: 'set',
        path: path,
        oldVal: oldVal,
        newVal: val
      });
    };

    ObjectProxy.prototype.splice = function(path, index, removeCount, inserted) {
      var ary;
      ary = this.get(path);
      if (!(ary instanceof Array)) {
        throw new Error("ObjectProxy.splice:not_an_array: " + path);
      }
      return this._splice(ary, path, index, removeCount, inserted);
    };

    ObjectProxy.prototype._splice = function(ary, path, index, removeCount, inserted) {
      var changed, evt, i, insertUpTo, removeUpTo, removed, shiftDiff, shiftStart, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3;
      shiftStart = index + removeCount;
      changed = [];
      if (shiftStart < ary.length) {
        shiftDiff = (index + inserted.length) - shiftStart;
        if (shiftDiff > 0) {
          for (i = _i = _ref = ary.length - 1, _ref1 = shiftStart - 1; _i > _ref1; i = _i += -1) {
            changed.push({
              type: 'move',
              path: "" + path + "." + i,
              oldVal: ary[i],
              newVal: ary[i + shiftDiff],
              toPath: "" + path + "." + (i + shiftDiff)
            });
          }
        } else if (shiftDiff < 0) {
          for (i = _j = shiftStart, _ref2 = ary.length; shiftStart <= _ref2 ? _j < _ref2 : _j > _ref2; i = shiftStart <= _ref2 ? ++_j : --_j) {
            changed.push({
              type: 'move',
              path: "" + path + "." + i,
              oldVal: ary[i],
              newVal: ary[i + shiftDiff],
              toPath: "" + path + "." + (i + shiftDiff)
            });
          }
        }
      }
      removeUpTo = Math.min(shiftStart, ary.length);
      insertUpTo = index + inserted.length;
      for (i = _k = index, _ref3 = Math.max(removeUpTo, insertUpTo); index <= _ref3 ? _k < _ref3 : _k > _ref3; i = index <= _ref3 ? ++_k : --_k) {
        if (i < removeUpTo && i < insertUpTo) {
          changed.push({
            type: 'set',
            path: "" + path + "." + i,
            oldVal: ary[i],
            newVal: inserted[i - index]
          });
        } else if (i < removeUpTo) {
          changed.push({
            type: 'delete',
            path: "" + path + "." + i,
            oldVal: ary[i]
          });
        } else if (i < insertUpTo) {
          changed.push({
            type: 'set',
            path: "" + path + "." + i,
            oldVal: void 0,
            newVal: inserted[i - index]
          });
        }
      }
      removed = ary.splice.apply(ary, [index, removeCount].concat(__slice.call(inserted)));
      for (_l = 0, _len = changed.length; _l < _len; _l++) {
        evt = changed[_l];
        this.emit(evt.type, evt);
      }
      return this.emit('splice', {
        type: 'splice',
        path: path,
        index: index,
        removed: removed,
        inserted: inserted
      });
    };

    ObjectProxy.prototype.push = function(path, inserted, evt) {
      var ary;
      if (!(inserted instanceof Array)) {
        throw new Error("ObjectProxy.push:not_an_array");
      }
      ary = this.get(path);
      return this._splice(ary, path, ary.length, 0, inserted, evt);
    };

    ObjectProxy.prototype.pop = function(path, evt) {
      var ary;
      ary = this.get(path);
      return this._splice(ary, path, ary.length - 1, 1, [], evt);
    };

    ObjectProxy.prototype.shift = function(path, evt) {
      return this.splice(path, 0, 1, [], evt);
    };

    ObjectProxy.prototype.unshift = function(path, inserted, evt) {
      if (!(inserted instanceof Array)) {
        throw new Error("ObjectProxy.unshift:not_an_array");
      }
      return this.splice(path, 0, 0, inserted, evt);
    };

    ObjectProxy.prototype.setAlias = function(path, path2) {
      this.map.setAlias(path, path2);
      return this.getProxy(path);
    };

    ObjectProxy.prototype["delete"] = function(path) {
      var key, parent, segs, _ref;
      _ref = this._pathWithKey(path), segs = _ref[0], key = _ref[1];
      parent = this._get(segs, this.data);
      if (parent instanceof Object) {
        return this._delete(path, parent, key);
      } else {
        throw new Error("ObjectProxy.delete:not_an_object: " + path);
      }
    };

    ObjectProxy.prototype._delete = function(path, parent, key) {
      var oldVal;
      oldVal = parent[key];
      delete parent[key];
      return this.emit('delete', {
        type: 'delete',
        path: path,
        oldVal: oldVal
      });
    };

    return ObjectProxy;

  })(EventEmitter);

  module.exports = ObjectProxy;

}).call(this);

  return module.exports;
})({exports: {}});
// src/runtime
var ___SRC_RUNTIME___ = (function(module) {
  (function() {
  var Compiler, ObjectProxy, Runtime, TemplateManager, WidgetFactory, builtIn;

  Compiler = ___SRC_COMPILER___;

  TemplateManager = ___SRC_TEMPLATE___;

  WidgetFactory = ___SRC_WIDGET___;

  ObjectProxy = ___SRC_OBJECT___;

  builtIn = {};

  builtIn.delay = function(milli, val, cb) {
    var helper, id,
      _this = this;
    id = null;
    helper = function() {
      clearTimeout(id);
      return cb(null, val);
    };
    return id = setTimeout(helper, milli);
  };

  Runtime = (function() {

    Runtime.ObjectProxy = ObjectProxy;

    Runtime.registerWidget = function(name, widget) {
      return WidgetFactory.register(name, widget);
    };

    Runtime.registerFunc = function(name, proc) {
      var helper;
      if (!proc instanceof Function) {
        throw new Error("Runtime.registerFunc:not_a_function: " + proc);
      }
      if (builtIn.hasOwnProperty(name)) {
        throw new Error("Runtime.registerFunc:name_already_in_use: " + name);
      }
      helper = function() {
        var args, cb, i, res, self;
        cb = arguments[arguments.length - 1];
        args = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = arguments.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(arguments[i]);
          }
          return _results;
        }).apply(this, arguments);
        self = this;
        try {
          res = proc.apply(this, args);
          return cb(null, res);
        } catch (e) {
          return cb(e);
        }
      };
      return builtIn[name] = helper;
    };

    Runtime.registerAsyncFunc = function(name, proc) {
      if (!proc instanceof Function) {
        throw new Error("Runtime.registerFunc:not_a_function: " + proc);
      }
      if (builtIn.hasOwnProperty(name)) {
        throw new Error("Runtime.registerFunc:name_already_in_use: " + name);
      }
      return builtIn[name] = proc;
    };

    function Runtime($, data) {
      this.$ = $;
      if (data == null) {
        data = {};
      }
      this.compiler = new Compiler(this);
      this.factory = new TemplateManager(this);
      this.context = new ObjectProxy(data);
      this.env = builtIn;
    }

    Runtime.prototype.compile = function(stmt) {
      return this.compiler.compile(stmt, this);
    };

    Runtime.prototype.parse = function(stmt) {
      return this.compiler.parse(stmt);
    };

    Runtime.prototype.loadTemplates = function() {
      return this.factory.load();
    };

    Runtime.prototype.renderView = function(element, tplName, context) {
      if (context == null) {
        context = this.context.getProxy('.');
      }
      return this.factory.setView(element, tplName, context);
    };

    Runtime.prototype.initializeView = function(element) {
      return this.factory.initializeView(element);
    };

    return Runtime;

  })();

  module.exports = Runtime;

}).call(this);

  return module.exports;
})({exports: {}});


  return ___SRC_RUNTIME___;
});
