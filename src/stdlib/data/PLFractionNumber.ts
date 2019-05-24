import { gcd } from 'lang/utils/math'
import {
  add,
  BaseNumberOp,
  divide,
  equals,
  multiple,
  negate,
  SerializeToJS,
  Setoid,
  subtract,
  toJS
} from 'stdlib/types'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { plBool } from 'stdlib/data/PLBool'
import { typeCheck } from 'stdlib/utils'

interface JSFractionNumber {
  numerator: number
  denominator: number
}

///

class PLFractionNumber
  implements
    SerializeToJS<JSFractionNumber>,
    Setoid<PLFractionNumber>,
    BaseNumberOp<PLFractionNumber> {
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

  [equals](a: PLFractionNumber) {
    return plBool(this.numerator === a.numerator && this.denominator === a.denominator)
  }

  [negate]() {
    return new PLFractionNumber(-this._n, this._d)
  }

  [add](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator + this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  [subtract](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator - this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  [multiple](a: PLFractionNumber) {
    const numerator = this.numerator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  [divide](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator
    const denominator = this.denominator * a.numerator
    return new PLFractionNumber(numerator, denominator)
  }

  [toJS]() {
    return {
      numerator: this._n,
      denominator: this._d
    }
  }

  public toString() {
    return `${this._n}/${this._d}`
  }
}

///

export const plFractionNumber = (n: number, d: number): PLFractionNumber => {
  return new PLFractionNumber(n, d)
}

export const str2plFractionNumber = (str: string) => {
  const [n, d] = str.split('/').map(parseFloat)
  if (isValid(n, d)) {
    return new PLFractionNumber(n, d)
  } else {
    throw new RuntimeError(`Invalid fraction number: ${str}.`)
  }
}

export const reciprocal = (fn: PLFractionNumber): PLFractionNumber => {
  typeCheck(PLFractionNumber, fn)
  return plFractionNumber(fn.denominator, fn.numerator)
}

///

const isValid = (n: number, d: number) => {
  return Number.isInteger(n) && Number.isInteger(d) && d !== 0
}
