import { expect } from 'chai'
import { Scanner } from '../src'
import { Literal, LiteralType, Parser } from '../src/parser'
import { FractionNumber } from '../src/dataTypes/FractionNumber'

describe('Parser', () => {
  it('should parse empty source', () => {
    const parser = new Parser(new Scanner(''))
    const parseRes = parser.parse()

    expect(parseRes.hasError).equal(false)
    expect(parseRes.program).deep.equals([])
  })

  it('should parse empty source with comment', () => {
    const parser = new Parser(new Scanner('; comment'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse integer number', () => {
    const parser = new Parser(new Scanner('42'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Integer, 42)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse float number', () => {
    const parser = new Parser(new Scanner('42.5'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Float, 42.5)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse fraction number', () => {
    const parser = new Parser(new Scanner('4/2'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Fraction, new FractionNumber(2, 1))]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse string', () => {
    const parser = new Parser(new Scanner('"hello world"'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.String, 'hello world')]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse identifier', () => {
    const parser = new Parser(new Scanner('add'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Identifier, 'add')]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse list expression', () => {
    const parser = new Parser(new Scanner('(add 1 2)'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[
      new Literal(LiteralType.List, [
        new Literal(LiteralType.Identifier, 'add'),
        new Literal(LiteralType.Integer, 1),
        new Literal(LiteralType.Integer, 2)
      ])
    ]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse array expression', () => {
    const parser = new Parser(new Scanner('[1 2]'))
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[
      new Literal(LiteralType.Array, [
        new Literal(LiteralType.Integer, 1),
        new Literal(LiteralType.Integer, 2)
      ])
    ]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse 2 lines of code', () => {
    const parser = new Parser(
      new Scanner(`
      (print "hello world")
      (print (+ 1 2))
    `)
    )
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[
      new Literal(LiteralType.List, [
        new Literal(LiteralType.Identifier, 'print'),
        new Literal(LiteralType.String, 'hello world')
      ]),
      new Literal(LiteralType.List, [
        new Literal(LiteralType.Identifier, 'print'),
        new Literal(LiteralType.List, [
          new Literal(LiteralType.Identifier, '+'),
          new Literal(LiteralType.Integer, 1),
          new Literal(LiteralType.Integer, 2)
        ])
      ])
    ]
    expect(parseRes.program).deep.equals(expected)
  })

  describe('error', () => {
    it('should thrown if parentheses is not closed', () => {
      const tests = [{ src: '(+ 1 2', error: ')' }, { src: '[1 2', error: ']' }]
      tests.map(({ src, error }) => {
        const parser = new Parser(new Scanner(src))
        const parseRes = parser.parse()
        expect(parseRes.hasError).equal(true)

        expect(parseRes.errors.length).equal(1)
        expect(parseRes.errors[0]).deep.equal({
          line: 1,
          message: `Expected '${error}'.`
        })
      })
    })

    it('should thrown if the token is unknown', () => {
      const parser = new Parser(new Scanner(':keyword'))
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)

      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors).deep.equal([
        {
          line: 0,
          message: `Unknown token`
        }
      ])
    })

    it('should thrown if the token is unknown', () => {
      const parser = new Parser(new Scanner('@'))
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)

      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors).deep.equal([
        {
          line: 1,
          message: `Unexpected character.`
        }
      ])
    })
  })
})
