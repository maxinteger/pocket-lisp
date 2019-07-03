import {
  BoxedValue,
  Functor,
  map,
  of,
  SApplicative,
  SerializeToJS,
  staticImplements,
  toJS
} from 'stdlib/types'

export type Maybe<T extends BoxedValue<any>> = Just<T> | NothingClass

///
// @ts-ignore
@staticImplements<SApplicative<any, Maybe<any>>>()
export class Just<T extends BoxedValue<any>> implements SerializeToJS<any>, Functor<T> {
  public static [of](value: any) {
    return maybe(value)
  }

  public constructor(private _value: T) {}

  public get value() {
    return this._value
  }

  public [map]<b>(fn: (a: T) => b): Functor<b> {
    return maybe(fn(this._value)) as any
  }

  public [toJS]() {
    return this._value[toJS] && this._value[toJS]()
  }

  public toString() {
    return `Just(${this._value.toString()})`
  }
}

///

// @ts-ignore
@staticImplements<SApplicative<any, Maybe<any>>>()
class NothingClass implements SerializeToJS<undefined>, Functor<undefined> {
  public static [of](value: any) {
    return maybe(value)
  }

  public get value() {
    return Nothing
  }


  public [map]<b>(): Functor<b> {
    return Nothing
  }

  public [toJS]() {
    return undefined
  }

  public toString() {
    return 'Nothing'
  }
}

export const Nothing = new NothingClass()

///

export const maybe: <T extends BoxedValue<any>>(v: any) => Maybe<T> = (value: any) => {
  if (value === undefined || value === null || value === Nothing) {
    return Nothing
  } else {
    return new Just(value)
  }
}
