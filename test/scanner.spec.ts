import { expect } from 'chai'
import { Scanner, Token, TokenType } from '../src/scanner'

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
    const expected = new Token(TokenType.ERROR, 'Unexpected character.', 1)
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

  it('should scan identifier ', () => {
    ;['x', 'hello', '+', '/', '_'].map(src => {
      const scanner = new Scanner(src)
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.IDENTIFIER, src, 1)
      expect(actual).deep.equal(expected)
    })
  })

  describe('should scan proper number token from', () => {
    it('integer', () => {
      const actual = new Scanner('42').scanToken()
      const expected = new Token(TokenType.INTEGER_NUMBER, '42', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative integer', () => {
      const actual = new Scanner('-42').scanToken()
      const expected = new Token(TokenType.INTEGER_NUMBER, '-42', 1)
      expect(actual).deep.equals(expected)
    })

    it('float', () => {
      const actual = new Scanner('42.5').scanToken()
      const expected = new Token(TokenType.FLOAT_NUMBER, '42.5', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative float', () => {
      const actual = new Scanner('-42.5').scanToken()
      const expected = new Token(TokenType.FLOAT_NUMBER, '-42.5', 1)
      expect(actual).deep.equals(expected)
    })

    it('fraction number', () => {
      const actual = new Scanner('1/2').scanToken()
      const expected = new Token(TokenType.FRACTION_NUMBER, '1/2', 1)
      expect(actual).deep.equals(expected)
    })

    it('negative fraction number', () => {
      const actual = new Scanner('-1/2').scanToken()
      const expected = new Token(TokenType.FRACTION_NUMBER, '-1/2', 1)
      expect(actual).deep.equals(expected)
    })
  })

  describe('should scan string', () => {
    it('successfully', () => {
      const scanner = new Scanner('"hello world"')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.STRING, '"hello world"', 1)
      expect(actual).deep.equal(expected)
    })
    it('with error if it is not terminated', () => {
      const scanner = new Scanner('"unterminated string')
      const actual = scanner.scanToken()
      const expected = new Token(TokenType.ERROR, 'Unterminated string', 1)
      expect(actual).deep.equal(expected)
    })
  })

  it('should scan keyword', () => {
    const scanner = new Scanner(':keyword"')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.KEYWORD, ':keyword', 1)
    expect(actual).deep.equal(expected)
  })

  it('should scan bracket', () => {
    const test = [
      { src: '(', token: TokenType.LEFT_PAREN },
      { src: ')', token: TokenType.RIGHT_PAREN },
      { src: '{', token: TokenType.LEFT_BRACE },
      { src: '}', token: TokenType.RIGHT_BRACE },
      { src: '[', token: TokenType.LEFT_SQUARE },
      { src: ']', token: TokenType.RIGHT_SQUARE }
    ]
    test.map(({ src, token }) => {
      const scanner = new Scanner(src)
      const actual = scanner.scanToken()
      const expected = new Token(token, src, 1)
      expect(actual).deep.equal(expected)
    })
  })
})
