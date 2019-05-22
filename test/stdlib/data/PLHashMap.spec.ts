import { expect } from 'chai'
import { plHashMap } from 'stdlib/data/PLHashMap'

describe('stdlib/core/HashMap', () => {
  it('should create empty plHashMap', () => {
    expect(plHashMap().toString()).deep.equal('{}')
  })
  it('should have proper toString', () => {
    expect(plHashMap([['a', 1], ['b', 2]]).toString()).deep.equal('{a: 1, b: 2}')
  })
})
