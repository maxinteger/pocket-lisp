class Vector<T> {
  constructor(private _value: T[]) {}

  toString() {
    return `[${this._value.join()}]`
  }
}

export const vector: <T>(value?: T[]) => Vector<T> = (value = []) => new Vector(value)
