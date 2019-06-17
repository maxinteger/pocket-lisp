import {
  concat,
  of,
  SApplicative,
  Semigroup,
  SerializeToJS,
  staticImplements,
  toJS
} from 'stdlib/types'

// @ts-ignore
@staticImplements<SApplicative<any[], PLVector<any>> | Semigroup<PLVector<any>>>()
export class PLVector<T> implements SerializeToJS<any[]> {
  public static [of](value: any[]) {
    return plVector(value)
  }

  public constructor(private _value: T[]) {}

  public get value() {
    return this._value
  }

  public [concat](a: PLVector<any>) {
    return plVector(...this._value.concat(a.value))
  }

  public [toJS]() {
    return this._value.map((x: any) => x[toJS]())
  }

  public toString() {
    return `[${this._value.join()}]`
  }
}

export const plVector: <T>(...value: T[]) => PLVector<T> = (...value) => new PLVector(value)
