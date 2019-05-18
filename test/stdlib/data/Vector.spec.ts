import { expect } from 'chai'
import { vector } from 'stdlib/data/Vector'

describe('stdlib/core/Vector', () => {
  it('should create empty Vector', () => {
    expect(vector()).deep.equal({ _value: [] })
  })
  it('should have proper toString', () => {
    expect(vector().toString()).deep.equal('[]')
    expect(vector([1, 2]).toString()).deep.equal('[1,2]')
  })
})
