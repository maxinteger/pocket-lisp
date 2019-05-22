import { SerializeToJS, toJS } from 'stdlib/types'

class PLString implements SerializeToJS<string> {
  constructor(private _value: string) {}

  get value() {
    return this._value
  }

  [toJS]() {
    return this._value
  }

  toString() {
    return this._value
  }
}

export const plString = (value: string = '') => new PLString(value)
