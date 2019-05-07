import { Environment } from './dataTypes/Environment'
import { Literal, LiteralType } from './parser'
import { RuntimeError } from './dataTypes/RuntimeError'
import { nativeFn } from './stdlib/utils'
import { PLCallable } from './types'

export interface InterpreterOptions {
  globals: { [key: string]: any }
  stdout?: (out: string) => void
  lockedGlobals?: boolean
}

export class Interpreter {
  private readonly globals = new Environment()
  private _currentEnv = this.globals
  constructor(options: InterpreterOptions = { lockedGlobals: true, globals: {} }) {
    const { stdout, globals, lockedGlobals } = options

    this.globals.define('print', nativeFn(stdout || console.log))

    Object.keys(globals).forEach(key => this.globals.define(key, globals[key], lockedGlobals))
  }

  public interpret(program: Literal<any>[]) {
    let returnVal: any = undefined
    try {
      for (let literal of program) {
        returnVal = this.execLiteral(literal)
      }
    } catch (e) {
      throw new RuntimeError(e)
    }
    return returnVal
  }

  public execLiteral = (literal: Literal<any>) => {
    switch (literal.kind) {
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.Fraction:
      case LiteralType.String:
      case LiteralType.Array:
        return literal.value
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return this._currentEnv.get(literal.value)
      case LiteralType.List:
        return this.execList(literal)
    }
  }

  private execList(literal: Literal<Literal<any>[]>): any {
    const [fnId, ...args] = literal.value
    if (fnId.kind === LiteralType.Identifier) {
      const fn = <PLCallable>this._currentEnv.get(fnId.value)
      return fn.call(this, args)
    }
    throw new RuntimeError(`'${fnId.value}' is not a function`)
  }

  get currentEnv(): Environment {
    return this._currentEnv
  }
}