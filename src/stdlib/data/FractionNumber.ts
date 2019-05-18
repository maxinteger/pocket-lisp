import { gcd } from 'utils/math'
import { add, BaseNumberOp, divide, equals, multiple, negate, Setoid, subtract } from 'stdlib/types'
import { RuntimeError } from 'dataTypes/RuntimeError'
import { plBool } from 'stdlib/data/Bool'

class FractionNumber implements Setoid<FractionNumber>, BaseNumberOp<FractionNumber> {
  private readonly _n: number
  private readonly _d: number

  constructor(numerator: number, denominator: number) {
    if (!isValid(numerator, denominator)) {
      throw new Error('Invalid fraction number parameters!')
    }

    if (denominator < 0) {
      numerator *= -1
      denominator *= -1
    }

    const divisor = gcd(Math.abs(numerator), Math.abs(denominator))
    this._n = numerator / divisor
    this._d = denominator / divisor
  }

  get numerator() {
    return this._n
  }

  get denominator() {
    return this._d
  }

  [equals](a: FractionNumber) {
    return plBool(this.numerator === a.numerator && this.denominator === a.denominator)
  }

  [negate]() {
    return new FractionNumber(-this._n, this._d)
  }

  [add](a: FractionNumber) {
    const numerator = this.numerator * a.denominator + this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new FractionNumber(numerator, denominator)
  }

  [subtract](a: FractionNumber) {
    const numerator = this.numerator * a.denominator - this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new FractionNumber(numerator, denominator)
  }

  [multiple](a: FractionNumber) {
    const numerator = this.numerator * a.numerator
    const denominator = this.denominator * a.denominator
    return new FractionNumber(numerator, denominator)
  }

  [divide](a: FractionNumber) {
    const numerator = this.numerator * a.denominator
    const denominator = this.denominator * a.numerator
    return new FractionNumber(numerator, denominator)
  }

  reciprocal(): FractionNumber {
    return new FractionNumber(this.denominator, this.numerator)
  }

  public toString() {
    return `${this._n}/${this._d}`
  }
}

///
export const fractionNumber = (n: number, d: number): FractionNumber => {
  return new FractionNumber(n, d)
}

export const str2fractionNumber = (str: string) => {
  const [n, d] = str.split('/').map(parseFloat)
  if (isValid(n, d)) {
    return new FractionNumber(n, d)
  } else {
    throw new RuntimeError(`Invalid fraction number: ${str}.`)
  }
}

///

const isValid = (n: number, d: number) => {
  return Number.isInteger(n) && Number.isInteger(d) && d !== 0
}
