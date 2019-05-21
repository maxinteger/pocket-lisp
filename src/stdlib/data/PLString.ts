class PLString {
  constructor(private _value: string) {}

  get value() {
    return this._value
  }

  toString() {
    return this._value
  }
}

export const plString = (value: string) => new PLString(value)

