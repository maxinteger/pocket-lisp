import { expect } from 'chai'
import { equals, lte, toJS } from 'stdlib/types'
import { plBool, str2plBool } from 'stdlib/data/PLBool'

describe('stdlib/core/PLBool', () => {
  describe('creation', () => {})

  describe('getters', () => {
    it('should work', () => {
      expect(plBool(true).value).equal(true)
      expect(plBool(false).value).equal(false)
    })
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plBool(true)[toJS]()).equals(true)
      expect(plBool(false)[toJS]()).equals(false)
    })
  })

  describe('parser', () => {
    it('should throw error if the input is invalid', () => {
      const tests = ['', 'xyz', '_']

      tests.map(input => {
        expect(() => str2plBool(input)).throw(`Invalid boolean: '${input}'.`)
      })
    })

    it('should parse proper fraction numbers', () => {
      const tests = [{ input: 'true', out: 'true' }, { input: 'false', out: 'false' }]

      tests.map(({ input, out }) => {
        expect(str2plBool(input).toString()).equal(out)
      })
    })
  })

  describe('equal operator', () => {
    it('should equal the bool', () => {
      expect(plBool(true)[equals](plBool(true))).deep.equals(plBool(true))
      expect(plBool(false)[equals](plBool(false))).deep.equals(plBool(true))
      expect(plBool(false)[equals](plBool(true))).deep.equals(plBool(false))
    })
  })

  describe('lte operator', () => {
    it('should lte the bool', () => {
      expect(plBool(true)[lte](plBool(false))).deep.equals(plBool(false))
      expect(plBool(false)[lte](plBool(true))).deep.equals(plBool(true))
    })
  })
})
