import { equals, lte, of, Ord, SApplicative, SerializeToJS, Setoid, staticImplements, toJS } from 'stdlib/types'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { typeCheck } from 'stdlib/utils'

// @ts-ignore
@staticImplements<SApplicative<boolean, PLBool>>()
export class PLBool
  implements SerializeToJS<boolean>, Setoid<PLBool>, Ord<PLBool> {
  public static [of](value: boolean): PLBool {
    return new PLBool(value)
  }

  public constructor(private _value: boolean) {}

  public get value() {
    return this._value
  }

  public [equals](a: PLBool) {
    return PLBool[of](this._value === a.value)
  }

  public [lte](a: PLBool) {
    return PLBool[of](this._value <= a.value)
  }

  public [toJS]() {
    return this._value
  }

  public toString() {
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
