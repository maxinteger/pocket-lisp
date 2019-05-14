import { equals, lte, of, Ord, SApplicative, Setoid, staticImplements } from 'stdlib/types'

@staticImplements<SApplicative<boolean, Bool>>()
export class Bool implements Setoid<boolean>, Ord<boolean> {
  constructor(private _value: boolean) {}

  get value() {
    return this._value
  }

  static [of](value: boolean): Bool {
    return new Bool(value)
  }

  [equals](a: Bool) {
    return Bool[of](this._value === a.value)
  }

  [lte](a: Bool) {
    return Bool[of](this._value <= a.value)
  }
}
