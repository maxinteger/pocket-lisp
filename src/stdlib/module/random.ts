import { plNumber, PLNumber } from 'stdlib/data/PLNumber'
import { plVector, PLVector } from 'stdlib/data/PLVector'
import { toInt } from 'stdlib/utils'

const rand = Math.random

/**
 * Return the next random floating point number in the range [0.0, 1.0).
 */
export const random = () => plNumber(rand())

/**
 * Return a random integer N such that a <= N <= b.
 */
export const randomInt = (a: PLNumber, b: PLNumber) => {
  const ai = toInt(a.value)
  const bi = toInt(b.value)
  return plNumber(toInt(ai + rand() * (bi - ai)))
}

/**
 * Shuffle vector
 */
export const shuffle = (v: PLVector<any>) => {
  return plVector(...[...v.value].sort(() => Math.round(rand() - 0.5)))
}
