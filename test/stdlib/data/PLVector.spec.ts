import { expect } from 'chai'
import { plVector } from 'stdlib/data/PLVector'
import { toJS } from 'stdlib/types'

describe('stdlib/core/PLVector', () => {
  it('should create empty Vector', () => {
    expect(plVector()).deep.equal({ _value: [] })
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
