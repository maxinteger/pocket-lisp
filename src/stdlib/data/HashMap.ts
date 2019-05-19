import { of, SApplicative, staticImplements } from 'stdlib/types'

type Entries = [any, any][]

@staticImplements<SApplicative<Entries, HashMap>>()
class HashMap {
  private readonly value: Map<any, any>

  constructor(entries?: Entries) {
    this.value = new Map(entries)
  }

  static [of](value: Entries): HashMap {
    return new HashMap(value)
  }

  toString() {
    return `{${Array.from(this.value.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}}`
  }
}

export const hashMap = (entries?: Entries) => HashMap[of](entries || [])
