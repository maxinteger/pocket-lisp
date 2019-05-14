import { gcd } from 'utils/math'
import { add, BaseNumberOp, divide, multiple, negate, subtract } from 'stdlib/types'
import { RuntimeError } from 'dataTypes/RuntimeError'

class FractionNumber implements BaseNumberOp<FractionNumber> {
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

  public toString() {
    return `${this._n}/${this._d}`
  }

  static parse(str: string) {
    const [n, d] = str.split('/').map(x => parseInt(x, 10))
    if (isValid(n, d)) {
      return new FractionNumber(n, d)
    } else {
      throw new RuntimeError(`Invalid fraction number: ${str}.`)
    }
  }
}

///
export const fractionNumber = (n: number | string, d?: number): FractionNumber => {
  if (typeof n === 'string') {
    return FractionNumber.parse(n)
  } else if (d !== undefined) {
    return new FractionNumber(n, d)
  } else {
    throw new RuntimeError(`Expected fraction number, but get ${n}, ${d}.`)
  }
}

export const reciprocal = (a: FractionNumber) => new FractionNumber(a.denominator, a.numerator)

///

const isValid = (n: number, d: number) => {
  return Number.isInteger(n) && Number.isInteger(d) && d !== 0
}
