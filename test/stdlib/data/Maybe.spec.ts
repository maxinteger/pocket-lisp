import { expect } from 'chai'
import { Just, maybe, Nothing } from 'stdlib/data/Maybe'
import { plNumber } from 'stdlib/data/PLNumber'
import { map, of, toJS } from 'stdlib/types'

describe('stdlib/core/Maybe', () => {
  describe('maybe function', () => {
    it('should return with Nothing instance for invalid values', () => {
      expect(maybe(undefined)).equals(Nothing)
      expect(maybe(null)).equals(Nothing)
      expect(maybe(Nothing)).equals(Nothing)
    })
    it('should return with Just instance for all other values', () => {
      expect(maybe(0)).deep.equals(new Just(0 as any))
      expect(maybe('hello world')).deep.equals(new Just('hello world' as any))
      expect(maybe([1, 2, 3])).deep.equals(new Just([1, 2, 3] as any))
    })
  })

  describe('of static function', () => {
    it('cshould return with the boxed value', () => {
      expect(Just[of](undefined)).equals(Nothing)
      expect(Just[of](1).value).equals(1)
    })
  })

  describe('map function', () => {
    it('should return with the calculated value in a Maybe box', () => {
      const mapFn = (x: number) => x + 1
      expect((maybe(1) as any)[map](mapFn)).deep.equals(new Just(2 as any))
      expect((maybe(undefined) as any)[map](mapFn)).equals(Nothing)
      expect((maybe(1) as any)[map](() => undefined)).equals(Nothing)
    })
  })

  it('should have proper toString', () => {
    expect(maybe(1).toString()).deep.equal('Just(1)')
    expect(maybe(undefined).toString()).deep.equal('Nothing')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(maybe(plNumber(1))[toJS]()).equals(1)
      expect(maybe(undefined)[toJS]()).equals(undefined)
      expect(maybe(Nothing)[toJS]()).equals(undefined)
    })
  })
})
