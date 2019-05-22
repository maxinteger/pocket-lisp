import { expect } from 'chai'
import { add, divide, equals, multiple, negate, subtract } from 'stdlib/types'
import { plNumber, str2PLNumber } from 'stdlib/data/PLNumber'
import { plBool } from 'stdlib/data/PLBool'

describe('Number', () => {
  describe('creation', () => {})

  describe('getters', () => {
    it('should work', () => {
      const actual = plNumber(1)
      expect(actual.value).equal(1)
    })
  })

  describe('parser', () => {
    it('should throw error if the input is invalid', () => {
      const tests = ['', 'xyz', '_']

      tests.map(input => {
        expect(() => str2PLNumber(input)).throw(`Invalid number: ${input}.`)
      })
    })

    it('should parse proper fraction numbers', () => {
      const tests = [
        { input: '0', out: '0' },
        { input: '10', out: '10' },
        { input: '1.5', out: '1.5' },
        { input: '-1', out: '-1' },
        { input: '-1.5', out: '-1.5' }
      ]

      tests.map(({ input, out }) => {
        expect(str2PLNumber(input).toString()).equal(out)
      })
    })
  })

  describe('equals operator', () => {
    it('should compare numbers', () => {
      expect(plNumber(2)[equals](plNumber(2))).deep.equals(plBool(true))
      expect(plNumber(2)[equals](plNumber(1))).deep.equals(plBool(false))
    })
  })

  describe('negate operator', () => {
    it('should negate the number', () => {
      expect(plNumber(-2)[negate]()).deep.equals(plNumber(2))
      expect(plNumber(2)[negate]()).deep.equals(plNumber(-2))
    })
  })

  describe('add operator', () => {
    it('should add two number', () => {
      const actual = plNumber(3)[add](plNumber(5))
      const expected = plNumber(8)
      expect(actual).deep.equals(expected)
    })
  })

  describe('subtract operator', () => {
    it('should subtract two number', () => {
      const actual = plNumber(2)[subtract](plNumber(6))
      const expected = plNumber(-4)
      expect(actual).deep.equals(expected)
    })
  })

  describe('multiple operator', () => {
    it('should multiple two number', () => {
      const actual = plNumber(2)[multiple](plNumber(5))
      const expected = plNumber(10)
      expect(actual).deep.equals(expected)
    })
  })

  describe('divide operator', () => {
    it('should divide two number', () => {
      const actual = plNumber(8)[divide](plNumber(4))
      const expected = plNumber(2)
      expect(actual).deep.equals(expected)
    })
  })
})
