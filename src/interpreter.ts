import { def, fn, ifFn, doFn } from './core'
import { Environment } from './dataTypes/Environment'
import { RuntimeError } from './dataTypes/RuntimeError'
import { simpleFunction } from './dataTypes/PLFunction'
import { Literal, LiteralType } from './dataTypes/Literal'
import { identity } from './utils/fn'
import { defaultLiterals } from './utils/defaultLiterals'
import { NATIVE_FN_NAME } from './utils/constants'
import { InterpreterOptions, PLCallable, PLLiterals } from './types'

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: {} as any,
  utils: {
    unboxing: identity
  }
}

///

export class Interpreter {
  private readonly globals = new Environment()
  private currentEnv: Environment = this.globals
  public readonly options: InterpreterOptions

  public constructor(options?: Partial<InterpreterOptions>, literals?: PLLiterals) {
    this.options = { ...defaultOptions, ...options } as any
    const { stdout, globals, lockedGlobals } = this.options
    const plLiterals = { ...defaultLiterals, ...literals }

    Object.keys(plLiterals).forEach((key) => {
      const fn = (plLiterals as any)[key].factory
      const arity = key === 'vector' || key === 'hashMap' ? -1 : fn.length
      this.globals.define(key, simpleFunction(fn, arity))
    })

    this.globals.define('print', simpleFunction(stdout || console.log, -1))
    this.globals.define('def', def)
    this.globals.define('if', ifFn)
    this.globals.define('fn', fn)
    this.globals.define('do', doFn)

    Object.keys(globals).forEach((key) => {
      const value = globals[key]
      let item = value
      if (typeof value === 'function' && value.toString() !== NATIVE_FN_NAME) {
        item = simpleFunction(value)
      }
      this.globals.define(key, item, lockedGlobals)
    })
  }

  public interpret(program: Literal<LiteralType>[]): any {
    let returnVal: unknown = undefined
    try {
      for (const literal of program) {
        returnVal = this.execLiteral(literal, this.globals)
      }
    } catch (e) {
      throw new RuntimeError(e)
    }
    return returnVal
  }

  public execLiteral = (literal: Literal<LiteralType>, env: Environment) => {
    this.currentEnv = env
    switch (literal.kind) {
      case LiteralType.Boolean:
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.FractionNumber:
      case LiteralType.String:
      case LiteralType.Keyword:
        return literal.value
      case LiteralType.Identifier:
        return env.get((literal as Literal<LiteralType.Identifier>).value)
      case LiteralType.List:
        return this.execList(literal as Literal<LiteralType.List>, env)
      default:
        return literal
    }
  }

  public evalFn(fn: PLCallable, args: any[]) {
    return fn.call(this, this.currentEnv, args)
  }

  private execList(literal: Literal<LiteralType.List>, env: Environment): unknown {
    const [fnId, ...args] = literal.value
    const fn: any = this.execLiteral(fnId, env)

    if (typeof fn.call === 'function') {
      return fn.call(this, env, args)
    }
    throw new RuntimeError(`'${fn}' is not a function`)
  }

  public getGlobalNames() {
    return this.globals.getNames()
  }
}
