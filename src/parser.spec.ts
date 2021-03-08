import { Scanner } from './scanner'
import { VECTOR_IDENTIFIER, Parser, FN_IDENTIFIER } from './parser'
import { defaultLiterals } from './utils/defaultLiterals'
import { Literal, LiteralType } from './dataTypes/Literal'
import { SnippetPosition } from './dataTypes/SnippetPosition'

describe('Parser', () => {
  it('should parse empty source', () => {
    const source = ''
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()

    expect(parseRes.hasError).toBe(false)
    expect(parseRes.program).toEqual([])
  })

  it('should parse empty source with comment', () => {
    const source = '; comment'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [] as unknown[]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse true boolean value', () => {
    const source = 'true'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.Boolean, true, new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse false boolean value', () => {
    const source = 'false'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.Boolean, false, new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse integer number', () => {
    const source = '42'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.Integer, 42, new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse float number', () => {
    const source = '42.5'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.Float, 42.5, new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse fraction number', () => {
    const source = '4/2'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.FractionNumber, '4/2', new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  describe('string', () => {
    it('should parse empty string', () => {
      const source = '""'
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(false)

      const expected = [new Literal(LiteralType.String, '', new SnippetPosition(source, 0, source.length, 1))]
      expect(parseRes.program).toEqual(expected)
    })

    it('should parse string', () => {
      const source = '"hello world"'
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(false)

      const expected = [
        new Literal(LiteralType.String, 'hello world', new SnippetPosition(source, 0, source.length, 1)),
      ]
      expect(parseRes.program).toEqual(expected)
    })
    it('should parse string with escaped values', () => {
      const source = '"hello \\n \\\\ \\" world \\n \\\\ \\""'
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(false)

      const expected = [
        new Literal(
          LiteralType.String,
          'hello \n \\ " world \n \\ "',
          new SnippetPosition(source, 0, source.length, 1),
        ),
      ]
      expect(parseRes.program).toEqual(expected)
    })
  })

  it('should parse identifier', () => {
    const source = 'add'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [new Literal(LiteralType.Identifier, 'add', new SnippetPosition(source, 0, source.length, 1))]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse list expression', () => {
    const source = '(add 1 2)'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [
      new Literal(
        LiteralType.List,
        [
          new Literal(LiteralType.Identifier, 'add', new SnippetPosition(source, 1, 4, 1)),
          new Literal(LiteralType.Integer, 1, new SnippetPosition(source, 5, 6, 1)),
          new Literal(LiteralType.Integer, 2, new SnippetPosition(source, 7, 8, 1)),
        ],
        new SnippetPosition(source, 0, 1, 1),
      ),
    ]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse array expression', () => {
    const source = '[1 2]'
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [
      new Literal(
        LiteralType.List,
        [
          new Literal(LiteralType.Identifier, VECTOR_IDENTIFIER, new SnippetPosition(source, 0, 1, 1)),
          new Literal(LiteralType.Integer, 1, new SnippetPosition(source, 1, 2, 1)),
          new Literal(LiteralType.Integer, 2, new SnippetPosition(source, 3, 4, 1)),
        ],
        new SnippetPosition(source, 0, 1, 1),
      ),
    ]
    expect(parseRes.program).toEqual(expected)
  })

  it('should parse 2 lines of code', () => {
    const source = `
      (print "hello world")
      (print (+ 1 2))
    `
    const parser = new Parser(new Scanner(source), defaultLiterals)
    const parseRes = parser.parse()
    expect(parseRes.hasError).toBe(false)

    const expected = [
      new Literal(
        LiteralType.List,
        [
          new Literal(LiteralType.Identifier, 'print', new SnippetPosition(source, 8, 13, 2)),
          new Literal(LiteralType.String, 'hello world', new SnippetPosition(source, 14, 27, 2)),
        ],
        new SnippetPosition(source, 7, 8, 2),
      ),
      new Literal(
        LiteralType.List,
        [
          new Literal(LiteralType.Identifier, 'print', new SnippetPosition(source, 36, 41, 3)),
          new Literal(
            LiteralType.List,
            [
              new Literal(LiteralType.Identifier, '+', new SnippetPosition(source, 43, 44, 3)),
              new Literal(LiteralType.Integer, 1, new SnippetPosition(source, 45, 46, 3)),
              new Literal(LiteralType.Integer, 2, new SnippetPosition(source, 47, 48, 3)),
            ],
            new SnippetPosition(source, 42, 43, 3),
          ),
        ],
        new SnippetPosition(source, 35, 36, 3),
      ),
    ]
    expect(parseRes.program).toEqual(expected)
  })

  describe('error', () => {
    it('should thrown if parentheses is not closed', () => {
      const tests = [
        { src: '(+ 1 2', error: ')', pos: 6 },
        { src: '[1 2', error: ']', pos: 4 },
      ]
      tests.map(({ src, error, pos }) => {
        const parser = new Parser(new Scanner(src), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).toBe(true)

        expect(parseRes.errors.length).toBe(1)
        expect(parseRes.errors[0]).toEqual({
          message: `Expected '${error}'.`,
          position: new SnippetPosition(src, pos, pos, 1),
        })
      })
    })

    it('should thrown if missing a literal parser', () => {
      const tests = ['Bool', 'Int', 'Float', 'FractionNumber', 'String']
      tests.map((type) => {
        const parser = new Parser(new Scanner('[true 42 42.5 1/2 "hello world"]'), {
          ...defaultLiterals,
          ...({ [type]: {} } as any),
        })
        const parseRes = parser.parse()
        expect(parseRes.hasError).toBe(true)
        expect(parseRes.errors.length).toBe(1)
        expect(parseRes.errors[0]).toEqual({
          message: `Missing parser '${type}'.`,
          position: new SnippetPosition('', 0, 0, 0),
        })
      })
    })

    it('should thrown if the token is unknown', () => {
      const parser = new Parser(new Scanner(')'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(true)

      expect(parseRes.errors.length).toBe(1)
      expect(parseRes.errors).toEqual([
        {
          message: `Unknown token: ')'.`,
          position: new SnippetPosition(')', 0, 1, 1),
        },
      ])
    })

    it('should thrown if the token is unknown', () => {
      const parser = new Parser(new Scanner('@'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(true)

      expect(parseRes.errors.length).toBe(1)
      expect(parseRes.errors).toEqual([
        {
          message: `Unexpected character '@'.`,
          position: new SnippetPosition('@', 0, 1, 1),
        },
      ])
    })

    it('should raise the first error and skip the rest', () => {
      const source = '@ ) ['
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(true)

      expect(parseRes.errors.length).toBe(1)
      expect(parseRes.errors).toEqual([
        {
          message: `Unexpected character '@'.`,
          position: new SnippetPosition(source, 0, 1, 1),
        },
      ])
    })
  })

  describe('dispatch', () => {
    it('should fail if the dispatch fallowed by other than list expression', () => {
      const source = '#42'
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(true)

      expect(parseRes.errors.length).toBe(1)
      expect(parseRes.errors).toEqual([
        {
          message: `List expression expected after dispatch, but get 'int'.`,
          position: new SnippetPosition(source, 3, 3, 1),
        },
      ])
    })

    it('should fail if found nexted dispatch', () => {
      const source = '#(1 2 #())'
      const parser = new Parser(new Scanner(source), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(true)

      expect(parseRes.errors.length).toBe(1)
      expect(parseRes.errors).toEqual([
        {
          message: `Nested dispatch expression not allowed.`,
          position: new SnippetPosition(source, 7, 8, 1),
        },
      ])
    })

    it('should allow multiple dispatches', () => {
      const parser = new Parser(new Scanner('#(+ 1 2) #(+ 3 4)'), defaultLiterals)
      const parseRes = parser.parse()
      expect(parseRes.hasError).toBe(false)
    })

    describe('#()', () => {
      it('should crete an anonymous function', () => {
        const source = `#(+ %2 %1)`
        const parser = new Parser(new Scanner(source), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).toBe(false)

        const expected = [
          new Literal(
            LiteralType.List,
            [
              new Literal(LiteralType.Identifier, FN_IDENTIFIER, new SnippetPosition(source, 1, 2, 1)),
              new Literal(
                LiteralType.List,
                [
                  new Literal(LiteralType.Identifier, VECTOR_IDENTIFIER, new SnippetPosition(source, 1, 2, 1)),
                  new Literal(LiteralType.Identifier, '%1', new SnippetPosition(source, 1, 2, 1)),
                  new Literal(LiteralType.Identifier, '%2', new SnippetPosition(source, 1, 2, 1)),
                ],
                new SnippetPosition(source, 1, 2, 1),
              ),
              new Literal(
                LiteralType.List,
                [
                  new Literal(LiteralType.Identifier, '+', new SnippetPosition(source, 2, 3, 1)),
                  new Literal(LiteralType.Identifier, '%2', new SnippetPosition(source, 4, 6, 1)),
                  new Literal(LiteralType.Identifier, '%1', new SnippetPosition(source, 7, 9, 1)),
                ],
                new SnippetPosition(source, 1, 2, 1),
              ),
            ],
            new SnippetPosition(source, 1, 2, 1),
          ),
        ]
        expect(parseRes.program).toEqual(expected)
      })
    })

    describe('#{}', () => {
      it('should fail because it is not implemented', () => {
        const source = '#{}'
        const parser = new Parser(new Scanner(source), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).toBe(true)

        expect(parseRes.errors.length).toBe(1)
        expect(parseRes.errors).toEqual([
          {
            message: `Invalid dispatch: #{...}.`,
            position: new SnippetPosition(source, 3, 3, 1),
          },
        ])
      })
    })

    describe('#[]', () => {
      it('should fail because it is not implemented', () => {
        const source = '#[]'
        const parser = new Parser(new Scanner(source), defaultLiterals)
        const parseRes = parser.parse()
        expect(parseRes.hasError).toBe(true)

        expect(parseRes.errors.length).toBe(1)
        expect(parseRes.errors).toEqual([
          {
            message: `Invalid dispatch: #[...].`,
            position: new SnippetPosition(source, 3, 3, 1),
          },
        ])
      })
    })
  })
})
