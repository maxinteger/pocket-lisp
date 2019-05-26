import { of, SApplicative, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

@staticImplements<SApplicative<string, PLString>>()
export class PLString implements SerializeToJS<string> {
  static [of](value: string) {
    return plString(value)
  }

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
