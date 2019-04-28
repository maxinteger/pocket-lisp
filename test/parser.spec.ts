import { expect } from 'chai'
import { Literal, LiteralType, Parser } from '../src/parser'
import {FractionNumber} from '../src/dataTypes/FractionNumber'

describe('Parser', () => {
  it('should parse empty source', () => {
    const parser = new Parser('')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[]
    expect(actual).deep.equals(expected)
  })

  it('should parse integer number', () => {
    const parser = new Parser('42')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[new Literal(LiteralType.Integer, 42)]
    expect(actual).deep.equals(expected)
  })

  it('should parse float number', () => {
    const parser = new Parser('42.5')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[new Literal(LiteralType.Float, 42.5)]
    expect(actual).deep.equals(expected)
  })

  it('should parse fraction number', () => {
    const parser = new Parser('4/2')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[new Literal(LiteralType.Fraction, new FractionNumber(2, 1))]
    expect(actual).deep.equals(expected)
  })

  it('should parse string', () => {
    const parser = new Parser('"hello world"')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[new Literal(LiteralType.String, "hello world")]
    expect(actual).deep.equals(expected)
  })

  it('should parse identifier', () => {
    const parser = new Parser('add')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[new Literal(LiteralType.Identifier, "add")]
    expect(actual).deep.equals(expected)
  })

  it('should parse list expression', () => {
    const parser = new Parser('(add 1 2)')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[
      new Literal(LiteralType.List, [
        new Literal(LiteralType.Identifier, "add"),
        new Literal(LiteralType.Integer, 1),
        new Literal(LiteralType.Integer, 2)
      ])
    ]
    expect(actual).deep.equals(expected)
  })

  it('should parse array expression', () => {
    const parser = new Parser('[1 2]')
    parser.parse()
    const actual = parser.expressions
    const expected = <any>[
      new Literal(LiteralType.Array, [
        new Literal(LiteralType.Integer, 1),
        new Literal(LiteralType.Integer, 2)
      ])
    ]
    expect(actual).deep.equals(expected)
  })
})