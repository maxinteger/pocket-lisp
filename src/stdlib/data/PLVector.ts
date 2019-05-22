import { SerializeToJS, toJS } from 'stdlib/types'

class PLVector<T> implements SerializeToJS<any[]> {
  constructor(private _value: T[]) {}

  [toJS]() {
    return this._value
  }

  toString() {
    return `[${this._value.join()}]`
  }
}

export const plVector: <T>(value?: T[]) => PLVector<T> = (value = []) => new PLVector(value)
