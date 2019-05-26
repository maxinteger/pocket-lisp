import { of, SApplicative, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

type Entries = [any, any][]

@staticImplements<SApplicative<Entries, PLHashMap>>()
export class PLHashMap implements SerializeToJS<Map<any, any>> {
  private readonly _value: Map<any, any>

  static [of](value: Entries): PLHashMap {
    return new PLHashMap(value)
  }

  constructor(entries?: Entries) {
    this._value = new Map(entries)
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
