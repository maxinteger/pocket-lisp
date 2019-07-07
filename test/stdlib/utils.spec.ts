import { assertType, chunk, toInt } from 'stdlib/utils'
import { expect } from 'chai'
import { plBool } from 'stdlib/data/PLBool'

describe('stdlib utils', () => {
  describe('assertType', () => {
    it('should throws error if the params have different constructors', () => {
      expect(() => assertType(plBool(true), Boolean(false))).throws(
        `Type mismatch between: 'PLBool' and 'Boolean'`
      )
    })
    it('should does nothing if the params have the same constructors', () => {
      expect(() => assertType(plBool(true), plBool(false))).not.throw()
    })
  })
  describe('chunk', () => {
    it('should return with empty array if the input is empty', () => {
      const actual = chunk([])
      const expected: any = []
      expect(actual).deep.equals(expected)
    })
    it('should return with proper chunked array', () => {
      const tests = [
        { input: [1], output: [[1]] },
        { input: [1, 2], output: [[1, 2]] },
        { input: [1, 2, 3], output: [[1, 2], [3]] },
        { input: [1, 2, 3, 4], output: [[1, 2], [3, 4]] }
      ]
      tests.map(({ input, output }) => {
        expect(chunk(input)).deep.equals(output)
      })
    })
    it('should return with proper chunked array if chunk size is 3', () => {
      const tests = [
        { input: [1], output: [[1]] },
        { input: [1, 2], output: [[1, 2]] },
        { input: [1, 2, 3], output: [[1, 2, 3]] },
        { input: [1, 2, 3, 4], output: [[1, 2, 3], [4]] }
      ]
      tests.map(({ input, output }) => {
        expect(chunk(input, 3)).deep.equals(output)
      })
    })
  })

  describe('toInt', () => {
    it('should convert any valid number to integer', () => {
      const tests = [{ a: 1, e: 1 }, { a: 1.1, e: 1 }, { a: 0.9, e: 0 }]
      tests.map(({ a, e }) => expect(toInt(a)).equals(e))
    })

    it('should return with 0 for any other value', () => {
      const tests = [NaN, 'asd', [], {}]
      tests.map(v => expect(toInt(v as any)).equals(0))
    })
  })
})
