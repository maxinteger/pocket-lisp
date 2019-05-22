import { expect } from 'chai'
import { plVector } from 'stdlib/data/PLVector'

describe('stdlib/core/Vector', () => {
  it('should create empty Vector', () => {
    expect(plVector()).deep.equal({ _value: [] })
  })
  it('should have proper toString', () => {
    expect(plVector().toString()).deep.equal('[]')
    expect(plVector([1, 2]).toString()).deep.equal('[1,2]')
  })
})
