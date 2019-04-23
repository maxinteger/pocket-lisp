import {expect} from 'chai'
import {Scanner, Token, TokenType} from '../src/scanner'

describe('Scanner', () => {

  it('should scan EOF on empty source', () => {
    const scanner = new Scanner('')
    const actual = scanner.scanToken()
    const expected = new Token(TokenType.EOF, '', 1)
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

  describe('should scan FLOAT_NUMBER token from', () => {
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
})
