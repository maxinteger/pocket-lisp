import { expect } from 'chai'
import { concat, of, toJS } from 'stdlib/types'
import { PLString, plString } from 'stdlib/data/PLString'

describe('stdlib/core/PLString', () => {
  describe('creation', () => {
    describe('with of', () => {
      it('should have same result as the factory function', () => {
        expect(PLString[of]('hello world')).deep.equals(plString('hello world'))
      })
    })
  })

  it('should create empty String', () => {
    expect(plString()).deep.equal({ _value: '' })
  })

  describe('getters', () => {
    it('should work', () => {
      const actual = plString('OK')
      expect(actual.value).equal('OK')
    })
  })

  describe('concat', () => {
    it('should concatenate 2 strings', () => {
      const actual = plString('hello')[concat](plString(' '))[concat](plString('world'))
      expect(actual.value).equal('hello world')
    })
  })

  it('should have proper toString', () => {
    expect(plString().toString()).equal('')
    expect(plString('hello world').toString()).equal('hello world')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plString('hello world')[toJS]()).equal('hello world')
    })
  })
})
