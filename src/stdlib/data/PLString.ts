import { concat, of, SApplicative, Semigroup, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

// @ts-ignore
@staticImplements<SApplicative<string, PLString> | Semigroup<PLString>>()
export class PLString implements SerializeToJS<string> {
  public static [of](value: string) {
    return plString(value)
  }

  public constructor(private _value: string) {}

  public get value() {
    return this._value
  }

  public [concat](a: PLString) {
    return plString(this._value + a.value)
  }

  public [toJS]() {
    return this._value
  }

  public toString() {
    return this._value
  }
}

export const plString = (value: string = '') => new PLString(value)
