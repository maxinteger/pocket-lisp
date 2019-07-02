import { expect } from 'chai'
import { PLVector, plVector } from 'stdlib/data/PLVector'
import { concat, map, of, toJS } from 'stdlib/types'
import { plNumber } from 'stdlib/data/PLNumber'

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

  describe('getters', () => {
    it('should work', () => {
      expect(plVector(...[]).value).deep.equal([])
      expect(plVector(...[1, 2, 3]).value).deep.equal([1, 2, 3])
    })
  })

  describe('concat', () => {
    it('should concatenate 2 vectors', () => {
      const actual = plVector(...[1])
        [concat](plVector(...[2]))
        [concat](plVector(...[3]))
      expect(actual).deep.equal(plVector(...[1, 2, 3]))
    })
  })

  describe('map', () => {
    it('should exec a function on all array item', () => {
      const actual = plVector(...[1, 2, 3])[map](a => a * 10)
      expect(actual).deep.equal(plVector(...[10, 20, 30]))
    })

    it('should work with empty input', () => {
      const actual = plVector(...[])[map](a => a * 10)
      expect(actual).deep.equal(plVector(...[]))
    })
  })

  it('should have proper toString', () => {
    expect(plVector().toString()).deep.equal('[]')
    expect(plVector([1, 2]).toString()).deep.equal('[1,2]')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plVector(...[plNumber(1), plNumber(2), plNumber(3)])[toJS]()).deep.equal([1, 2, 3])
    })
  })
})
