
parser = require '../src/covalent'

parseTest = (stmt, exp) ->
  it "should parse \"#{stmt}\"", () ->
    test.equal parser.parse(stmt), exp

describe 'parser test', () ->

  parseTest '1', 1

  parseTest '1 + 1', {op: '+', lhs: 1, rhs: 1}

  parseTest '1 + 2 * 3', {op: '+', lhs: 1, rhs: {op: '*', lhs: 2, rhs: 3}}

  parseTest '1', 1

  parseTest '2.5', 2.5

  parseTest '2.5 // this is ignored',  2.5

  parseTest '"hello this is a string"', "hello this is a string"

  parseTest "'hello this is a string'", "hello this is a string"

  parseTest '$id', {cell: 'id'}

  parseTest '$/id', {cell: '/id'}

  parseTest '$/id.bar', {cell: '/id.bar'}

  parseTest '$.', {cell: '.'}

  parseTest '$test', {cell: 'test'}

  parseTest '$hello-path', {cell: 'hello-path'}

  parseTest 'this', {element: 'this'}

  parseTest 'test', {id: 'test'}

  parseTest '!$test', {op: '!', lhs: {cell: 'test'}}

  parseTest '(!$test)', {op: '!', lhs: {cell: 'test'}}

  parseTest '2 /* this is comment */ * 3 ',  {op: '*', lhs: 2, rhs: 3}

  parseTest '{ foo: 1, bar: 2}', {object: [['foo', 1], ['bar', 2]]}

  parseTest '1 <= $id', {op: '<=', lhs: 1, rhs: {cell: 'id'}}

