import { add, BaseNumberOp, divide, equals, multiple, negate, Setoid, subtract } from 'stdlib/types'
import { RuntimeError } from 'dataTypes/RuntimeError'
import { plBool } from 'stdlib/data/Bool'

export class PLNumber implements Setoid<PLNumber>, BaseNumberOp<PLNumber> {
  constructor(private _value: number) {}

  get value() {
    return this._value
  }

  [equals](a: PLNumber) {
    return plBool(this._value === a.value)
  }

  [negate]() {
    return new PLNumber(-this._value)
  }

  [add](a: PLNumber) {
    return new PLNumber(this._value + a.value)
  }

  [subtract](a: PLNumber) {
    return new PLNumber(this._value - a.value)
  }

  [multiple](a: PLNumber) {
    return new PLNumber(this._value * a.value)
  }

  [divide](a: PLNumber) {
    return new PLNumber(this._value / a.value)
  }

  toString() {
    return this._value.toString()
  }
}

export const str2PLNumber = (str: string) => {
  const val = parseFloat(str)
  if (isNaN(val)) {
    throw new RuntimeError(`Invalid number: ${str}.`)
  }
  return new PLNumber(val)
}

export const plNumber = (value: number) => new PLNumber(value)
