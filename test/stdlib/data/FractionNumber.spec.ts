import { expect } from 'chai'
import { fractionNumber, str2fractionNumber } from 'stdlib/data/FractionNumber'

describe('Fraction number', () => {
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
        expect(() => fractionNumber(n, d)).throw('Invalid fraction number parameters!')
      })
    })

    it('should accept valid inputs', () => {
      const tests = [{ n: 1, d: 1, res: '1/1' }, { n: 1, d: 2, res: '1/2' }] as {
        n: any
        d: any
        res: string
      }[]

      tests.map(({ n, d, res }) => {
        expect(fractionNumber(n, d).toString()).eq(res)
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
        expect(fractionNumber(n, d).toString()).eq(res)
      })
    })
  })

  describe('getters', () => {
    it('should work', () => {
      const actual = fractionNumber(1, 2)
      expect(actual.numerator).equal(1)
      expect(actual.denominator).equal(2)
    })
  })

  describe('parser', () => {
    it('should throw error if the input is invalid', () => {
      const tests = ['', 'xyz', '1', '1/', '1.1/1', '1/1.1', '1/0']

      tests.map(input => {
        expect(() => str2fractionNumber(input)).throw(`Invalid fraction number: ${input}.`)
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
        expect(str2fractionNumber(input).toString()).equal(out)
      })
    })
  })
})
