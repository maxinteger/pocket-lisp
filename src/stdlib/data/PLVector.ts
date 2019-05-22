class PLVector<T> {
  constructor(private _value: T[]) {}

  toString() {
    return `[${this._value.join()}]`
  }
}

export const plVector: <T>(value?: T[]) => PLVector<T> = (value = []) => new PLVector(value)
