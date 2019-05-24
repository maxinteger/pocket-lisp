import {
  equals,
  Functor,
  lte,
  map,
  of,
  Ord,
  SApplicative,
  SerializeToJS,
  Setoid,
  staticImplements,
  toJS
} from 'stdlib/types'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { typeCheck } from 'stdlib/utils'

@staticImplements<SApplicative<boolean, PLBool>>()
export class PLBool
  implements SerializeToJS<boolean>, Setoid<PLBool>, Ord<PLBool>, Functor<PLBool, PLBool> {
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

  [toJS]() {
    return this._value
  }

  toString() {
    return this._value.toString()
  }
}

///

export const plBool = (value: boolean) => new PLBool(value)

export const str2plBool = (str: string) => {
  switch (str) {
    case 'true':
      return plBool(true)
    case 'false':
      return plBool(false)
    default:
      throw new RuntimeError(`Invalid boolean: '${str}'.`)
  }
}

///

export const not = (x: PLBool) => {
  typeCheck(PLBool, x)
  return plBool(!x.value)
}

export const and = (x: PLBool, y: PLBool) => {
  typeCheck(PLBool, x)
  typeCheck(PLBool, y)
  return plBool(x.value && y.value)
}

export const or = (x: PLBool, y: PLBool) => {
  typeCheck(PLBool, x)
  typeCheck(PLBool, y)
  return plBool(x.value || y.value)
}
