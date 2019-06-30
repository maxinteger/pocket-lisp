import { Environment } from 'lang/dataTypes/Environment'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { InterpreterOptions, PLCallable, PLLiterals } from 'lang/types'
import { defaultLiterals } from 'lang/utils/defaultLiterals'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { def, fn, ifFn } from 'lang/core'
import { simpleFunction } from 'lang/dataTypes/PLFunction'
import { identity } from 'lang/utils/fn'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'
import { doFn } from 'lang/core/do'

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

    Object.keys(plLiterals).forEach(key => {
      this.globals.define(key, simpleFunction((plLiterals as any)[key].factory))
    })

    this.globals.define('print', simpleFunction(stdout || console.log, -1))
    this.globals.define('def', def)
    this.globals.define('if', ifFn)
    this.globals.define('fn', fn)
    this.globals.define('do', doFn)

    Object.keys(globals).forEach(key => {
      const value = globals[key]
      const fn = value.toString() === NATIVE_FN_NAME ? value : simpleFunction(value)
      this.globals.define(key, fn, lockedGlobals)
    })
  }

  public interpret(program: Literal<LiteralType>[]): any {
    let returnVal: unknown = undefined
    try {
      for (let literal of program) {
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
        return literal.value
      case LiteralType.Keyword:
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
}
