import { Scanner } from './scanner'
import { Token, TokenType } from './dataTypes/Token'
import { SnippetPosition } from './dataTypes/SnippetPosition'

describe('Scanner', () => {
  it('should scan EOF on empty source', () => {
    const scanner = new Scanner('')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', new SnippetPosition('', 0, 0, 1))
    expect(actual).toEqual(expected)
  })

  it('should trow error token when find an unexpected char', () => {
    const source = 'Á'
    const scanner = new Scanner(source)
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Error, `Unexpected character 'Á'.`, new SnippetPosition(source, 0, 1, 1))
    expect(actual).toEqual(expected)
  })

  it('should ignore whitespaces', () => {
    const source = '   \t \n , , \n'
    const scanner = new Scanner(source)
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', new SnippetPosition(source, 12, 12, 3))
    expect(actual).toEqual(expected)
  })

  it('should ignore comments', () => {
    const source = '; this is a comment'
    const scanner = new Scanner(source)
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', new SnippetPosition(source, 19, 19, 1))
    expect(actual).toEqual(expected)
  })

  describe('multiline comment', () => {
    it('should ignore multiline comments', () => {
      const source = ';# this is a comment #;'
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.EOF, '', new SnippetPosition(source, 23, 23, 1))
      expect(actual).toEqual(expected)
    })

    it('should ignore multiline comments with line break', () => {
      const source = ';# this is \na \n  comment #;'
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.EOF, '', new SnippetPosition(source, 27, 27, 3))
      expect(actual).toEqual(expected)
    })

    it('should work inside lists', () => {
      const source = '(1 ;# this is \na \n  comment #; 2 3)'
      const scanner = new Scanner(source)
      const tokens = []
      let actual
      do {
        tokens.push((actual = scanner.scanToken()))
      } while (actual.type !== TokenType.EOF)

      expect(tokens).toEqual([
        new Token(TokenType.LeftParen, '(', new SnippetPosition(source, 0, 1, 1)),
        new Token(TokenType.Integer, '1', new SnippetPosition(source, 1, 2, 1)),
        new Token(TokenType.Integer, '2', new SnippetPosition(source, 31, 32, 3)),
        new Token(TokenType.Integer, '3', new SnippetPosition(source, 33, 34, 3)),
        new Token(TokenType.RightParen, ')', new SnippetPosition(source, 34, 35, 3)),
        new Token(TokenType.EOF, '', new SnippetPosition(source, 35, 35, 3)),
      ])
    })
  })

  describe('identifier', () => {
    it('should scanned in generic case', () => {
      const tests = ['x', 'hello', '+', '/', '_', ':']

      tests.map((src) => {
        const scanner = new Scanner(src)
        const actual = scanner.scanToken()
        const expected = new Token(TokenType.Identifier, src, new SnippetPosition(src, 0, src.length, 1))
        expect(actual).toEqual(expected)
      })
    })

    it('should ignored the white spaces around the identifier', () => {
      const source = '  add  '
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.Identifier, 'add', new SnippetPosition(source, 2, 5, 1))
      expect(actual).toEqual(expected)
    })
  })

  describe('should scan', () => {
    it('true', () => {
      const source = 'true'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.True, 'true', new SnippetPosition(source, 0, 4, 1))
      expect(actual).toEqual(expected)
    })

    it('false', () => {
      const source = 'false'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.False, 'false', new SnippetPosition(source, 0, 5, 1))
      expect(actual).toEqual(expected)
    })

    it('integer', () => {
      const source = '42'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.Integer, '42', new SnippetPosition(source, 0, 2, 1))
      expect(actual).toEqual(expected)
    })

    it('negative integer', () => {
      const source = '-42'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.Integer, '-42', new SnippetPosition(source, 0, 3, 1))
      expect(actual).toEqual(expected)
    })

    it('float', () => {
      const source = '42.5'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.Float, '42.5', new SnippetPosition(source, 0, 4, 1))
      expect(actual).toEqual(expected)
    })

    it('negative float', () => {
      const source = '-42.5'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.Float, '-42.5', new SnippetPosition(source, 0, 5, 1))
      expect(actual).toEqual(expected)
    })

    it('fraction number', () => {
      const source = '1/2'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.FractionNumber, '1/2', new SnippetPosition(source, 0, 3, 1))
      expect(actual).toEqual(expected)
    })

    it('negative fraction number', () => {
      const source = '-1/2'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.FractionNumber, '-1/2', new SnippetPosition(source, 0, 4, 1))
      expect(actual).toEqual(expected)
    })

    it('partial fraction number with error', () => {
      const source = '1/'
      const actual = new Scanner(source).scanToken()
      const expected = new Token(TokenType.Error, 'Unterminated fraction number', new SnippetPosition(source, 0, 1, 1))
      expect(actual).toEqual(expected)
    })
  })

  describe('should scan string', () => {
    it('successfully', () => {
      const source = '"hello world"'
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.String, 'hello world', new SnippetPosition(source, 0, source.length, 1))
      expect(actual).toEqual(expected)
    })

    it('successfully with linebreaks', () => {
      const source = '"hello \n world"'
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.String, 'hello \n world', new SnippetPosition(source, 0, source.length, 2))
      expect(actual).toEqual(expected)
    })

    it('with error if it is not terminated', () => {
      const source = '"unterminated string'
      const scanner = new Scanner(source)
      const actual = scanner.scanToken()
      const expected = new Token(
        TokenType.Error,
        'Unterminated string',
        new SnippetPosition(source, 0, source.length, 1),
      )
      expect(actual).toEqual(expected)
    })
  })

  it('should scan keyword', () => {
    const source = ':keyword'
    const scanner = new Scanner(source)
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Keyword, 'keyword', new SnippetPosition(source, 0, source.length, 1))
    expect(actual).toEqual(expected)
  })

  it('should scan dispatch', () => {
    const source = '#'
    const scanner = new Scanner(source)
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Dispatch, '#', new SnippetPosition(source, 0, source.length, 1))
    expect(actual).toEqual(expected)
  })

  it('should scan bracket', () => {
    const test = [
      { src: '(', token: TokenType.LeftParen },
      { src: ')', token: TokenType.RightParen },
      { src: '{', token: TokenType.LeftBrace },
      { src: '}', token: TokenType.RightBrace },
      { src: '[', token: TokenType.LeftSquare },
      { src: ']', token: TokenType.RightSquare },
    ]
    test.map(({ src, token }) => {
      const scanner = new Scanner(src)
      const actual = scanner.scanToken()
      const expected = new Token(token, src, new SnippetPosition(src, 0, src.length, 1))
      expect(actual).toEqual(expected)
    })
  })

  it('should tokenize 2 lines of code', () => {
    const source = `
      (print "hello world")
      (print (+ 1 2))
    `
    const scanner = new Scanner(source)
    const actual = scanner.scanAllToken()
    const expected = [
      // line 2
      new Token(TokenType.LeftParen, '(', new SnippetPosition(source, 7, 8, 2)),
      new Token(TokenType.Identifier, 'print', new SnippetPosition(source, 8, 13, 2)),
      new Token(TokenType.String, 'hello world', new SnippetPosition(source, 14, 27, 2)),
      new Token(TokenType.RightParen, ')', new SnippetPosition(source, 27, 28, 2)),
      // line 3
      new Token(TokenType.LeftParen, '(', new SnippetPosition(source, 35, 36, 3)),
      new Token(TokenType.Identifier, 'print', new SnippetPosition(source, 36, 41, 3)),
      new Token(TokenType.LeftParen, '(', new SnippetPosition(source, 42, 43, 3)),
      new Token(TokenType.Identifier, '+', new SnippetPosition(source, 43, 44, 3)),
      new Token(TokenType.Integer, '1', new SnippetPosition(source, 45, 46, 3)),
      new Token(TokenType.Integer, '2', new SnippetPosition(source, 47, 48, 3)),
      new Token(TokenType.RightParen, ')', new SnippetPosition(source, 48, 49, 3)),
      new Token(TokenType.RightParen, ')', new SnippetPosition(source, 49, 50, 3)),
      new Token(TokenType.EOF, '', new SnippetPosition(source, 55, 55, 4)),
    ]
    expect(actual).toEqual(expected)
  })
})
