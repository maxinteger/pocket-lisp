import { expect } from 'chai'
import { Scanner, Token, TokenType } from './scanner'

describe('Scanner', () => {
  it('should scan EOF on empty source', () => {
    const scanner = new Scanner('')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', 1)
    expect(actual).deep.equal(expected)
  })

  it('should trow error token when find an unexpected char', () => {
    const scanner = new Scanner('Á')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Error, `Unexpected character 'Á'.`, 1)
    expect(actual).deep.equal(expected)
  })

  it('should ignore whitespaces', () => {
    const scanner = new Scanner('   \t \n , , \n')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', 3)
    expect(actual).deep.equal(expected)
  })

  it('should ignore comments', () => {
    const scanner = new Scanner('; this is a comment')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', 1)
    expect(actual).deep.equal(expected)
  })

  describe('identifier', () => {
    it('should scanned in generic case', () => {
      const tests = ['x', 'hello', '+', '/', '_', ':']

      tests.map(src => {
        const scanner = new Scanner(src)
        const actual = scanner.scanToken()
        const expected = new Token(TokenType.Identifier, src, 1)
        expect(actual).deep.equal(expected)
      })
    })

    it('should ignored the white spaces around the identifier', () => {
      const scanner = new Scanner('  add  ')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.Identifier, 'add', 1)
      expect(actual).deep.equal(expected)
    })
  })

  describe('should scan', () => {
    it('true', () => {
      const actual = new Scanner('true').scanToken()
      const expected = new Token(TokenType.True, 'true', 1)
      expect(actual).deep.equals(expected)
    })

    it('false', () => {
      const actual = new Scanner('false').scanToken()
      const expected = new Token(TokenType.False, 'false', 1)
      expect(actual).deep.equals(expected)
    })

    it('integer', () => {
      const actual = new Scanner('42').scanToken()
      const expected = new Token(TokenType.Integer, '42', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative integer', () => {
      const actual = new Scanner('-42').scanToken()
      const expected = new Token(TokenType.Integer, '-42', 1)
      expect(actual).deep.equals(expected)
    })

    it('float', () => {
      const actual = new Scanner('42.5').scanToken()
      const expected = new Token(TokenType.Float, '42.5', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative float', () => {
      const actual = new Scanner('-42.5').scanToken()
      const expected = new Token(TokenType.Float, '-42.5', 1)
      expect(actual).deep.equals(expected)
    })

    it('fraction number', () => {
      const actual = new Scanner('1/2').scanToken()
      const expected = new Token(TokenType.FractionNumber, '1/2', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative fraction number', () => {
      const actual = new Scanner('-1/2').scanToken()
      const expected = new Token(TokenType.FractionNumber, '-1/2', 1)
      expect(actual).deep.equals(expected)
    })

    it('partial fraction number with error', () => {
      const actual = new Scanner('1/').scanToken()
      const expected = new Token(TokenType.Error, 'Unterminated fraction number', 1)
      expect(actual).deep.equal(expected)
    })
  })

  describe('should scan string', () => {
    it('successfully', () => {
      const scanner = new Scanner('"hello world"')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.String, 'hello world', 1)
      expect(actual).deep.equal(expected)
    })

    it('successfully with linebreaks', () => {
      const scanner = new Scanner('"hello \n world"')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.String, 'hello \n world', 2)
      expect(actual).deep.equal(expected)
    })

    it('with error if it is not terminated', () => {
      const scanner = new Scanner('"unterminated string')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.Error, 'Unterminated string', 1)
      expect(actual).deep.equal(expected)
    })
  })

  it('should scan keyword', () => {
    const scanner = new Scanner(':keyword"')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Keyword, ':keyword', 1)
    expect(actual).deep.equal(expected)
  })

  it('should scan dispatch', () => {
    const scanner = new Scanner('#')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.Dispatch, '#', 1)
    expect(actual).deep.equal(expected)
  })

  it('should scan bracket', () => {
    const test = [
      { src: '(', token: TokenType.LeftParen },
      { src: ')', token: TokenType.RightParen },
      { src: '{', token: TokenType.LeftBrace },
      { src: '}', token: TokenType.RightBrace },
      { src: '[', token: TokenType.LeftSquare },
      { src: ']', token: TokenType.RightSquare }
    ]
    test.map(({ src, token }) => {
      const scanner = new Scanner(src)
      const actual = scanner.scanToken()
      const expected = new Token(token, src, 1)
      expect(actual).deep.equal(expected)
    })
  })

  it('should tokenize 2 lines of code', () => {
    const scanner = new Scanner(`
      (print "hello world")
      (print (+ 1 2))
    `)
    const actual = scanner.scanAllToken()
    const expected = [
      // line 2
      new Token(TokenType.LeftParen, '(', 2),
      new Token(TokenType.Identifier, 'print', 2),
      new Token(TokenType.String, 'hello world', 2),
      new Token(TokenType.RightParen, ')', 2),
      // line 3
      new Token(TokenType.LeftParen, '(', 3),
      new Token(TokenType.Identifier, 'print', 3),
      new Token(TokenType.LeftParen, '(', 3),
      new Token(TokenType.Identifier, '+', 3),
      new Token(TokenType.Integer, '1', 3),
      new Token(TokenType.Integer, '2', 3),
      new Token(TokenType.RightParen, ')', 3),
      new Token(TokenType.RightParen, ')', 3),
      new Token(TokenType.EOF, '', 4)
    ]
    expect(actual).deep.equal(expected)
  })
})
