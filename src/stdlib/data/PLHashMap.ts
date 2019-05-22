import { of, SApplicative, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

type Entries = [any, any][]

@staticImplements<SApplicative<Entries, PLHashMap>>()
class PLHashMap implements SerializeToJS<Map<any, any>> {
  private readonly _value: Map<any, any>

  constructor(entries?: Entries) {
    this._value = new Map(entries)
  }

  static [of](value: Entries): PLHashMap {
    return new PLHashMap(value)
  }

  [toJS]() {
    return this._value
  }

  toString() {
    return `{${Array.from(this._value.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}}`
  }
}

export const plHashMap = (entries?: Entries) => PLHashMap[of](entries || [])
