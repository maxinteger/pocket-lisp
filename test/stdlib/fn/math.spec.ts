import {
  abs,
  cbrt,
  ceil,
  E,
  exp,
  floor,
  LN10,
  LN2,
  log10,
  LOG10E,
  log2,
  LOG2E,
  max,
  min,
  PI,
  pow,
  round,
  sign,
  sqrt,
  SQRT1_2,
  SQRT2,
  trunc,
  log,
  deg2rad,
  rad2deg,
  sin,
  asin,
  asinh,
  cos,
  acos,
  acosh,
  tan,
  atan,
  atan2,
  atanh
} from 'stdlib/fn/math'
import { plNumber } from 'stdlib/data/PLNumber'
import { expect } from 'chai'

describe('stdlib/fn/math', () => {
  describe('constants', () => {
    it('should be OK', () => {
      const tests = [
        { actual: E, expected: plNumber(Math.E) },
        { actual: LN2, expected: plNumber(Math.LN2) },
        { actual: LN10, expected: plNumber(Math.LN10) },
        { actual: LOG2E, expected: plNumber(Math.LOG2E) },
        { actual: LOG10E, expected: plNumber(Math.LOG10E) },
        { actual: PI, expected: plNumber(Math.PI) },
        { actual: SQRT1_2, expected: plNumber(Math.SQRT1_2) },
        { actual: SQRT2, expected: plNumber(Math.SQRT2) }
      ]
      tests.map(({ actual, expected }) => expect(actual).deep.equal(expected))
    })
  })

  describe('base functions', () => {
    it('should be OK', () => {
      const tests = [
        { actual: abs(plNumber(-1.5)), expected: plNumber(1.5) },
        { actual: sign(plNumber(1.5)), expected: plNumber(1) },
        { actual: min(plNumber(1.5), plNumber(0)), expected: plNumber(0) },
        { actual: max(plNumber(1.5), plNumber(1)), expected: plNumber(1.5) },
        { actual: floor(plNumber(1.5)), expected: plNumber(1) },
        { actual: round(plNumber(1.5)), expected: plNumber(2) },
        { actual: ceil(plNumber(1.5)), expected: plNumber(2) },
        { actual: trunc(plNumber(1.5)), expected: plNumber(1) }
      ]
      tests.map(({ actual, expected }) => expect(actual).deep.equal(expected))
    })
  })

  describe('arithmetic functions', () => {
    it('should be OK', () => {
      const tests = [
        { actual: cbrt(plNumber(1.5)), expected: plNumber(Math.cbrt(1.5)) },
        { actual: sqrt(plNumber(1.5)), expected: plNumber(Math.sqrt(1.5)) },
        { actual: exp(plNumber(1.5)), expected: plNumber(Math.exp(1.5)) },
        { actual: pow(plNumber(1.5), plNumber(10)), expected: plNumber(Math.pow(1.5, 10)) },
        { actual: log(plNumber(1.5)), expected: plNumber(Math.log(1.5)) },
        { actual: log2(plNumber(1.5)), expected: plNumber(Math.log2(1.5)) },
        { actual: log10(plNumber(1.5)), expected: plNumber(Math.log10(1.5)) }
      ]
      tests.map(({ actual, expected }) => expect(actual).deep.equal(expected))
    })
  })

  describe('trigonometry functions', () => {
    it('should be OK', () => {
      const tests = [
        { actual: deg2rad(plNumber(180)), expected: PI },
        { actual: rad2deg(PI), expected: plNumber(180) },
        { actual: sin(plNumber(1.5)), expected: plNumber(Math.sin(1.5)) },
        { actual: asin(plNumber(1.5)), expected: plNumber(Math.asin(1.5)) },
        { actual: asinh(plNumber(1.5)), expected: plNumber(Math.asinh(1.5)) },
        { actual: cos(plNumber(1.5)), expected: plNumber(Math.cos(1.5)) },
        { actual: acos(plNumber(1.5)), expected: plNumber(Math.acos(1.5)) },
        { actual: acosh(plNumber(1.5)), expected: plNumber(Math.acosh(1.5)) },
        { actual: tan(plNumber(1.5)), expected: plNumber(Math.tan(1.5)) },
        { actual: atan(plNumber(1.5)), expected: plNumber(Math.atan(1.5)) },
        { actual: atan2(plNumber(1.5), plNumber(19)), expected: plNumber(Math.atan2(1.5, 19)) },
        { actual: atanh(plNumber(1.5)), expected: plNumber(Math.atanh(1.5)) }
      ]
      tests.map(({ actual, expected }) => expect(actual).deep.equal(expected))
    })
  })
})
