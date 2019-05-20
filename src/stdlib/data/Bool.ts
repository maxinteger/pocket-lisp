import { equals, Functor, lte, map, of, Ord, SApplicative, Setoid, staticImplements } from 'stdlib/types'
import { RuntimeError } from 'dataTypes/RuntimeError'

@staticImplements<SApplicative<boolean, PLBool>>()
export class PLBool implements Setoid<PLBool>, Ord<PLBool>, Functor<PLBool, PLBool> {
  constructor(private _value: boolean) {}

  get value() {
    return this._value
  }

  static [of](value: boolean): PLBool {
    return new PLBool(value)
  }

  [equals](a: PLBool) {
    return PLBool[of](this._value === a.value)
  }

  [lte](a: PLBool) {
    return PLBool[of](this._value <= a.value)
  }

  [map]<b>(f: (a: PLBool) => b): PLBool {
    return new PLBool(f(this) as any)
  }

  toString() {
    return this._value.toString()
  }
}

export const plBool = (value: boolean) => new PLBool(value)

export const str2bool = (str: string) => {
  switch (str) {
    case 'true':
      return plBool(true)
    case 'false':
      return plBool(false)
    default:
      throw new RuntimeError(`Invalid boolean: '${str}'.`)
  }
}
