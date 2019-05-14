import { add, BaseNumberOp, divide, multiple, negate, subtract } from 'stdlib/types'

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
}
