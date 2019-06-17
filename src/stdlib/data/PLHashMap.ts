import { of, SApplicative, SerializeToJS, staticImplements, toJS } from 'stdlib/types'

type Entries = [any, any][]

// @ts-ignore
@staticImplements<SApplicative<Entries, PLHashMap>>()
export class PLHashMap implements SerializeToJS<Map<any, any>> {
  private readonly _value: Map<any, any>

  public static [of](value: Entries): PLHashMap {
    return new PLHashMap(value)
  }

  public constructor(entries?: Entries) {
    this._value = new Map(entries)
  }

  public [toJS]() {
    return this._value
  }

  public toString() {
    return `{${Array.from(this._value.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}}`
  }
}

export const plHashMap = (entries?: Entries) => PLHashMap[of](entries || [])
