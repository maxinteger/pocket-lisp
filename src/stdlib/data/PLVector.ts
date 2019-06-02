import {
  concat,
  of,
  SApplicative,
  Semigroup,
  SerializeToJS,
  staticImplements,
  toJS
} from 'stdlib/types'

@staticImplements<SApplicative<any[], PLVector<any>> | Semigroup<PLVector<any>>>()
export class PLVector<T> implements SerializeToJS<any[]> {
  static [of](value: any[]) {
    return plVector(value)
  }

  constructor(private _value: T[]) {}

  get value() {
    return this._value
  }

  [concat](a: PLVector<any>) {
    return plVector(this._value.concat(a.value))
  }

  [toJS]() {
    return this._value
  }

  toString() {
    return `[${this._value.join()}]`
  }
}

export const plVector: <T>(value?: T[]) => PLVector<T> = (value = []) => new PLVector(value)
