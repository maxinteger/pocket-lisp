import { RuntimeError } from './RuntimeError'

export class Environment {
  private values = Object.create(null)

  constructor(private enclosing: Environment | null = null) {}

  public define(name: string, value: any) {
    this.values[name] = value
  }

  public get(name: string): any {
    if (this.values[name]) {
      return this.values[name]
    } else if (this.enclosing !== null) {
      return this.enclosing.get(name)
    } else {
      throw new RuntimeError(`Undefined variable: '${name}'.`)
    }
  }

  public assign(name: string, value: any): void {
    if (this.values[name]) {
      this.values[name] = value
    } else if (this.enclosing !== null) {
      return this.enclosing.assign(name, value)
    } else {
      throw new RuntimeError(`Undefined variable: '${name}'.`)
    }
  }
}
