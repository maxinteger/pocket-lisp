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

export class PLNumber implements SerializeToJS<number>, Setoid<PLNumber>, BaseNumberOp<PLNumber> {
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

  [toJS]() {
    return this._value
  }

  toString() {
    return this._value.toString()
  }
}

export const plNumber = (value: number) => new PLNumber(value)

export const str2PLNumber = (str: string) => {
  const val = parseFloat(str)
  if (isNaN(val)) {
    throw new RuntimeError(`Invalid number: ${str}.`)
  }
  return new PLNumber(val)
}
