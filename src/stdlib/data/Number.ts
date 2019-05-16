import { add, BaseNumberOp, divide, multiple, negate, subtract } from 'stdlib/types'
import { RuntimeError } from 'dataTypes/RuntimeError'

export class PLNumber implements BaseNumberOp<PLNumber> {
  constructor(private _value: number) {}

  get value() {
    return this._value
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
