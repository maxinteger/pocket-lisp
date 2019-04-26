import { expect } from 'chai'
import { FractionNumber } from '../../src/dataTypes/FractionNumber'

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
        expect(() => new FractionNumber(n, d)).throw('Invalid fraction number parameters!')
      })
    })

    it('should accept valid inputs', () => {
      const tests = [{ n: 1, d: 1, res: '1/1' }, { n: 1, d: 2, res: '1/2' }] as {
        n: any
        d: any
        res: string
      }[]

      tests.map(({ n, d, res }) => {
        expect(new FractionNumber(n, d).toString()).eq(res)
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
        expect(new FractionNumber(n, d).toString()).eq(res)
      })
    })
  })

  describe('parser', () => {
    it('should return with NaN if the input is invalid', () => {
      const tests = ['', 'xyz', '1', '1/', '1.1/1', '1/1.1', '1/0']

      tests.map(input => {
        expect(isNaN(<any>FractionNumber.parse(input))).equal(true)
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
        expect(FractionNumber.parse(input).toString()).equal(out)
      })
    })
  })
})
