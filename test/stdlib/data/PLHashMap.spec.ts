import { expect } from 'chai'
import { PLHashMap, plHashMap } from 'stdlib/data/PLHashMap'
import { of, toJS } from 'stdlib/types'

describe('stdlib/core/PLHashMap', () => {
  describe('creation with of', () => {
    it('should have same result as the factory function', () => {
      expect(PLHashMap[of]([['a', 1]])).deep.equals(plHashMap([['a', 1]]))
    })
  })
  it('should create empty plHashMap', () => {
    expect(plHashMap().toString()).deep.equal('{}')
  })
  it('should have proper toString', () => {
    expect(plHashMap([['a', 1], ['b', 2]]).toString()).deep.equal('{a: 1, b: 2}')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      const js = plHashMap([['a', 1], ['b', 2]])[toJS]()
      expect(Array.from(js.keys())).deep.equal(['a', 'b'])
      expect(Array.from(js.values())).deep.equal([1, 2])
    })
  })
})
