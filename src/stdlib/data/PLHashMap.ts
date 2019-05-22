import { of, SApplicative, staticImplements } from 'stdlib/types'

type Entries = [any, any][]

@staticImplements<SApplicative<Entries, PLHashMap>>()
class PLHashMap {
  private readonly value: Map<any, any>

  constructor(entries?: Entries) {
    this.value = new Map(entries)
  }

  static [of](value: Entries): PLHashMap {
    return new PLHashMap(value)
  }

  toString() {
    return `{${Array.from(this.value.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}}`
  }
}

export const plHashMap = (entries?: Entries) => PLHashMap[of](entries || [])
