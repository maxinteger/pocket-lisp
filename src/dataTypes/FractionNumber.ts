import {gcd} from '../utils/math'

export class FractionNumber {
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

  public toString() {
    return `${this._n}/${this._d}`
  }

  static parse(str: string) {
    const [n, d] = str.split('/').map(x => parseInt(x, 10))
    return isValid(n, d) ? new FractionNumber(n, d) : NaN
  }
}

///

const isValid = (n: number, d: number) => {
  return Number.isInteger(n) && Number.isInteger(d) && d !== 0
}