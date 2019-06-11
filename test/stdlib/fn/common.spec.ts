import { expect } from 'chai'
import { plBool } from 'stdlib/data/PLBool'
import { unboxing } from 'stdlib/fn/common'
import { plNumber } from 'stdlib/data/PLNumber'
import { plString } from 'stdlib/data/PLString'
import { plFractionNumber } from 'stdlib/data/PLFractionNumber'
import { plVector } from 'stdlib/data/PLVector'

describe('stdlib/fn/common', () => {
  describe('unboxing', () => {
    it('should unbox any stdlib value', () => {
      expect(unboxing(plBool(true))).equals(true)
      expect(unboxing(plNumber(42))).equals(42)
      expect(unboxing(plFractionNumber(1, 2))).deep.equals({ numerator: 1, denominator: 2 })
      expect(unboxing(plString('hello world'))).equals('hello world')
      expect(unboxing(plVector(plNumber(1), plNumber(2), plNumber(3)))).deep.equals([1, 2, 3])
    })
  })
})
