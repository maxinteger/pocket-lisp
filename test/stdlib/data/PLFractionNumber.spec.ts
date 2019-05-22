import { expect } from 'chai'
import { plFractionNumber, str2plFractionNumber } from 'stdlib/data/PLFractionNumber'
import { add, divide, equals, multiple, negate, subtract, toJS } from 'stdlib/types'
import { plBool } from 'stdlib/data/PLBool'

describe('stdlib/core/PLFractionNumber', () => {
  describe('creation', () => {
    it('should throw error if the parameters are invalid', () => {
      const tests = [
        { n: '1', d: 1 },
        { n: null, d: 1 },
        { n: undefined, d: 1 },
        { n: 1.1, d: 1 },
        { n: 1, d: 0 }
      ] as { n: any; d: any }[]

      tests.map(({ n, d }) => {
        expect(() => plFractionNumber(n, d)).throw('Invalid fraction number parameters!')
      })
    })

    it('should accept valid inputs', () => {
      const tests = [{ n: 1, d: 1, res: '1/1' }, { n: 1, d: 2, res: '1/2' }] as {
        n: any
        d: any
        res: string
      }[]

      tests.map(({ n, d, res }) => {
        expect(plFractionNumber(n, d).toString()).eq(res)
      })
    })

    it('should normalize the numerator and denominator', () => {
      const tests = [
        { n: 10, d: 10, res: '1/1' },
        { n: 10, d: 20, res: '1/2' },
        { n: 1, d: -2, res: '-1/2' },
        { n: -1, d: -2, res: '1/2' },
        { n: -1, d: 2, res: '-1/2' }
      ] as { n: any; d: any; res: string }[]

      tests.map(({ n, d, res }) => {
        expect(plFractionNumber(n, d).toString()).eq(res)
      })
    })
  })

  describe('getters', () => {
    it('should work', () => {
      const actual = plFractionNumber(1, 2)
      expect(actual.numerator).equal(1)
      expect(actual.denominator).equal(2)
    })
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plFractionNumber(1,2)[toJS]()).deep.equal({numerator: 1, denominator: 2})
    })
  })

  describe('parser', () => {
    it('should throw error if the input is invalid', () => {
      const tests = ['', 'xyz', '1', '1/', '1.1/1', '1/1.1', '1/0']

      tests.map(input => {
        expect(() => str2plFractionNumber(input)).throw(`Invalid fraction number: ${input}.`)
      })
    })

    it('should parse proper fraction numbers', () => {
      const tests = [
        { input: '1/1', out: '1/1' },
        { input: '10/10', out: '1/1' },
        { input: '1/2', out: '1/2' },
        { input: '1/-1', out: '-1/1' },
        { input: '-1/-1', out: '1/1' }
      ]

      tests.map(({ input, out }) => {
        expect(str2plFractionNumber(input).toString()).equal(out)
      })
    })
  })

  describe('equal operator', () => {
    it('should compare two number', () => {
      expect(plFractionNumber(1, 2)[equals](plFractionNumber(1, 2))).deep.equals(plBool(true))
      expect(plFractionNumber(1, 2)[equals](plFractionNumber(5, 10))).deep.equals(plBool(true))
      expect(plFractionNumber(1, 2)[equals](plFractionNumber(6, 10))).deep.equals(plBool(false))
      expect(plFractionNumber(1, 2)[equals](plFractionNumber(-1, 2))).deep.equals(plBool(false))
    })
  })

  describe('reciprocal operator', () => {
    it('should reciprocal the number', () => {
      expect(plFractionNumber(1, 2).reciprocal()).deep.equals(plFractionNumber(2, 1))
    })
  })

  describe('negate operator', () => {
    it('should negate the number', () => {
      expect(plFractionNumber(1, 2)[negate]()).deep.equals(plFractionNumber(-1, 2))
      expect(plFractionNumber(-1, 2)[negate]()).deep.equals(plFractionNumber(1, 2))
    })
  })

  describe('add operator', () => {
    it('should add two fraction number', () => {
      const actual = plFractionNumber(2, 3)[add](plFractionNumber(1, 5))
      const expected = plFractionNumber(13, 15)
      expect(actual).deep.equals(expected)
    })
  })

  describe('subtract operator', () => {
    it('should subtract two fraction number', () => {
      const actual = plFractionNumber(1, 2)[subtract](plFractionNumber(1, 6))
      const expected = plFractionNumber(2, 6)
      expect(actual).deep.equals(expected)
    })
  })

  describe('multiple operator', () => {
    it('should multiple two fraction number', () => {
      const actual = plFractionNumber(1, 2)[multiple](plFractionNumber(2, 5))
      const expected = plFractionNumber(1, 5)
      expect(actual).deep.equals(expected)
    })
  })

  describe('divide operator', () => {
    it('should divide two fraction number', () => {
      const actual = plFractionNumber(1, 8)[divide](plFractionNumber(1, 4))
      const expected = plFractionNumber(1, 2)
      expect(actual).deep.equals(expected)
    })
  })
})
