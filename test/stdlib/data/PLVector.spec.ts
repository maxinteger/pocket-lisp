import { expect } from 'chai'
import { PLVector, plVector } from 'stdlib/data/PLVector'
import { of, toJS } from 'stdlib/types'

describe('stdlib/core/PLVector', () => {
  describe('creation', () => {
    it('should create empty Vector', () => {
      expect(plVector()).deep.equal({ _value: [] })
    })
    describe('with of', () => {
      it('should have same result as the factory function', () => {
        expect(PLVector[of]([1, 2, 3])).deep.equals(plVector([1, 2, 3]))
      })
    })
  })

  it('should have proper toString', () => {
    expect(plVector().toString()).deep.equal('[]')
    expect(plVector([1, 2]).toString()).deep.equal('[1,2]')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plVector([1, 2, 3])[toJS]()).deep.equal([1, 2, 3])
    })
  })
})
