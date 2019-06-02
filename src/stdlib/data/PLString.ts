import { concat, of, SApplicative, Semigroup, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

@staticImplements<SApplicative<string, PLString> | Semigroup<PLString>>()
export class PLString implements SerializeToJS<string> {
  static [of](value: string) {
    return plString(value)
  }

  constructor(private _value: string) {}

  get value() {
    return this._value
  }

  [concat](a: PLString) {
    return plString(this._value + a.value)
  }

  [toJS]() {
    return this._value
  }

  toString() {
    return this._value
  }
}

export const plString = (value: string = '') => new PLString(value)
