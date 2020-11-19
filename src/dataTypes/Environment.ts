import { RuntimeError } from './RuntimeError'

export class Environment {
  private values = Object.create(null)
  private locked = Object.create(null)

  public constructor(private enclosing: Environment | null = null) {}

  public define(name: string, value: unknown, locked = false): void {
    if (!this.locked[name]) {
      this.values[name] = value
      if (locked) this.locked[name] = true
    } else {
      throw new RuntimeError(`'${name}' is locked and it is not re-definable.`)
    }
  }

  public get(name: string): unknown {
    if (this.values[name]) {
      return this.values[name]
    } else if (this.enclosing !== null) {
      return this.enclosing.get(name)
    } else {
      throw new RuntimeError(`Undefined identifier: '${name}'.`)
    }
  }

  public assign(name: string, value: unknown): void {
    if (this.values[name]) {
      this.values[name] = value
    } else if (this.enclosing !== null) {
      return this.enclosing.assign(name, value)
    } else {
      throw new RuntimeError(`Undefined identifier: '${name}'.`)
    }
  }

  public getNames(): string[] {
    return Object.keys(this.values)
  }

  public get parent(): Environment | null {
    return this.enclosing
  }
}
