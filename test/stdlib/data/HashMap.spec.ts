import { expect } from 'chai'
import { hashMap } from 'stdlib/data/HashMap'

describe('stdlib/core/HashMap', () => {
  it('should create empty hashMap', () => {
    expect(hashMap().toString()).deep.equal('{}')
  })
  it('should have proper toString', () => {
    expect(hashMap([['a', 1], ['b', 2]]).toString()).deep.equal('{a: 1, b: 2}')
  })
})
