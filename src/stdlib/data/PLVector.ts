import { of, SApplicative, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

@staticImplements<SApplicative<any[], PLVector<any>>>()
export class PLVector<T> implements SerializeToJS<any[]> {
  static [of](value: any[]) {
    return plVector(value)
  }

  constructor(private _value: T[]) {}

  [toJS]() {
    return this._value
  }

  toString() {
    return `[${this._value.join()}]`
  }
}

export const plVector: <T>(value?: T[]) => PLVector<T> = (value = []) => new PLVector(value)
