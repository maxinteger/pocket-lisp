import { expect } from 'chai'
import { random, randomInt, shuffle } from 'stdlib/module/random'
import { plNumber } from 'stdlib/data/PLNumber'
import { plVector } from 'stdlib/data/PLVector'

describe('stdlib/module/random', () => {
  describe('random function', () => {
    it('should return with PLNumber between 0 and 1', () => {
      const value = random().value
      expect(value <= 1).equals(true)
      expect(value >= 0).equals(true)
    })
  })

  describe('randomInt', () => {
    it('should return with integer PLNumber', () => {
      const value = randomInt(plNumber(10), plNumber(20)).value
      expect(value <= 20).equals(true)
      expect(value >= 10).equals(true)
      expect(~~value).equals(value)
    })
  })

  describe('shuffle', () => {
    it('should return with a new vector where the length does not change', () => {
      const value = shuffle(plVector(1, 2, 3)).value
      expect(value.length).equals(3)
      expect(value.includes(1)).equals(true)
      expect(value.includes(1)).equals(true)
      expect(value.includes(2)).equals(true)
    })
  })
})
