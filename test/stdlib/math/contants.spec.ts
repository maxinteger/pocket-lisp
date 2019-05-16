import { E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2 } from 'stdlib/math'
import { plNumber } from 'stdlib/data/Number'
import { expect } from 'chai'

describe('stdlib/math/constants', () => {
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
