import { expect } from 'chai'
import { Scanner } from 'lang/scanner'
import { VECTOR_IDENTIFIER, Literal, LiteralType, Parser } from 'lang/parser'
import { defaultLiterals } from 'lang/utils/defaultLiterals'

describe('Parser', () => {
  it('should parse empty source', () => {
    const parser = new Parser(new Scanner(''), defaultLiterals)
    const parseRes = parser.parse()

    expect(parseRes.hasError).equal(false)
    expect(parseRes.program).deep.equals([])
  })

  it('should parse empty source with comment', () => {
    const parser = new Parser(new Scanner('; comment'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse true boolean value', () => {
    const parser = new Parser(new Scanner('true'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Boolean, true)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse false boolean value', () => {
    const parser = new Parser(new Scanner('false'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Boolean, false)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse integer number', () => {
    const parser = new Parser(new Scanner('42'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Integer, 42)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse float number', () => {
    const parser = new Parser(new Scanner('42.5'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Float, 42.5)]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse fraction number', () => {
    const parser = new Parser(new Scanner('4/2'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.FractionNumber, '4/2')]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse string', () => {
    const parser = new Parser(new Scanner('"hello world"'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.String, 'hello world')]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse identifier', () => {
    const parser = new Parser(new Scanner('add'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[new Literal(LiteralType.Identifier, 'add')]
    expect(parseRes.program).deep.equals(expected)
  })

  it('should parse list expression', () => {
    const parser = new Parser(new Scanner('(add 1 2)'), defaultLiterals)
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
    const parser = new Parser(new Scanner('[1 2]'), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).equal(false)

    const expected = <any>[
      new Literal(LiteralType.List, [
        VECTOR_IDENTIFIER,
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
    `),
      defaultLiterals
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
        const parser = new Parser(new Scanner(src), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).equal(true)

        expect(parseRes.errors.length).equal(1)
        expect(parseRes.errors[0]).deep.equal({
          line: 1,
          message: `Expected '${error}'.`
        })
      })
    })

    it('should thrown if missing a literal parser', () => {
      const parser = new Parser(new Scanner('true'), {
        ...defaultLiterals,
        ...({ bool: {} } as any)
      })
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)
      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors[0]).deep.equal({
        line: 1,
        message: `Missing parser 'bool'.`
      })
    })

    it('should thrown if the token is unknown', () => {
      const parser = new Parser(new Scanner(':keyword'), defaultLiterals)
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
      const parser = new Parser(new Scanner('@'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)

      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors).deep.equal([
        {
          line: 1,
          message: `Unexpected character '@'.`
        }
      ])
    })
  })

  describe('dispatch', () => {
    it('should fail if the dispatch fallowed by other than list expression', () => {
      const parser = new Parser(new Scanner('#42'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)

      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors).deep.equal([
        {
          line: 1,
          message: `List expression expected after dispatch, but get 'int'.`
        }
      ])
    })

    it('should fail if found nexted dispatch', () => {
      const parser = new Parser(new Scanner('#(1 2 #())'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(true)

      expect(parseRes.errors.length).equal(1)
      expect(parseRes.errors).deep.equal([
        {
          line: 1,
          message: `Nested dispatch expression not allowed.`
        }
      ])
    })

    it('should allow multiple dispatches', () => {
      const parser = new Parser(new Scanner('#(+ 1 2) #(+ 3 4)'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).equal(false)
    })

    describe('#()', () => {
      it('should crete an anonymous function', () => {
        const parser = new Parser(new Scanner(`#(+ %2 %1)`), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).equal(false)

        const expected = <any>[
          new Literal(LiteralType.List, [
            new Literal(LiteralType.Identifier, 'fn'),
            new Literal(LiteralType.List, [
              new Literal(LiteralType.Identifier, 'vector'),
              new Literal(LiteralType.Identifier, '%1'),
              new Literal(LiteralType.Identifier, '%2')
            ]),
            new Literal(LiteralType.List, [
              new Literal(LiteralType.Identifier, '+'),
              new Literal(LiteralType.Identifier, '%2'),
              new Literal(LiteralType.Identifier, '%1')
            ])
          ])
        ]
        expect(parseRes.program).deep.equals(expected)
      })
    })

    describe('#{}', () => {
      it('should fail because it is not implemented', () => {
        const parser = new Parser(new Scanner('#{}'), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).equal(true)

        expect(parseRes.errors.length).equal(1)
        expect(parseRes.errors).deep.equal([
          {
            line: 1,
            message: `Invalid dispatch: #[...}.`
          }
        ])
      })
    })

    describe('#[]', () => {
      it('should fail because it is not implemented', () => {
        const parser = new Parser(new Scanner('#[]'), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).equal(true)

        expect(parseRes.errors.length).equal(1)
        expect(parseRes.errors).deep.equal([
          {
            line: 1,
            message: `Invalid dispatch: #[...].`
          }
        ])
      })
    })
  })
})
