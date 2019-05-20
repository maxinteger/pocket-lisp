import { Environment } from 'dataTypes/Environment'
import { Literal, LiteralType } from 'parser'
import { RuntimeError } from 'dataTypes/RuntimeError'
import { nativeFn } from 'stdlib/utils'
import { InterpreterOptions, PLCallable, PLLiterals } from 'types'
import { defaultLiterals } from 'utils/defaultLiterals'

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: <any>{}
}

///

export class Interpreter {
  private readonly globals = new Environment()
  private _currentEnv = this.globals

  constructor(options?: InterpreterOptions, literals?: PLLiterals) {
    const { stdout, globals, lockedGlobals } = { ...defaultOptions, ...options }
    const plLiterals = { ...literals, ...defaultLiterals }

    Object.keys(plLiterals).forEach(key => {
      this.globals.define(key, nativeFn((plLiterals as any)[key].factory))
    })

    this.globals.define('print', nativeFn(stdout || console.log))

    Object.keys(globals).forEach(key =>
      this.globals.define(key, nativeFn(globals[key]), lockedGlobals)
    )
  }

  public interpret(program: Literal<unknown>[]) {
    let returnVal: unknown = undefined
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
      case LiteralType.Boolean:
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.FractionNumber:
      case LiteralType.String:
        return literal.value
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return this._currentEnv.get(literal.value)
      case LiteralType.List:
        return this.execList(literal)
    }
  }

  private execList(literal: Literal<Literal<unknown>[]>): unknown {
    const [fnId, ...args] = literal.value
    if (fnId.kind === LiteralType.Identifier) {
      const fn = <PLCallable>this._currentEnv.get((fnId as Literal<string>).value)
      return fn.call(this, args)
    }
    throw new RuntimeError(`'${fnId.value}' is not a function`)
  }

  get currentEnv(): Environment {
    return this._currentEnv
  }
}
