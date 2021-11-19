import { def, fn, ifFn, doFn, defn, caseFn, constFn, sideEffectFn } from './core'
import { Environment } from './dataTypes/Environment'
import { RuntimeError } from './dataTypes/RuntimeError'
import { simpleFunction } from './dataTypes/PLFunction'
import { Literal, LiteralType } from './dataTypes/Literal'
import { identity } from './utils/fn'
import { defaultLiterals } from './utils/defaultLiterals'
import { NATIVE_FN_NAME } from './utils/constants'
import { InterpreterOptions, PLCallable, PLLiterals } from './types'
import { MAP_IDENTIFIER, VECTOR_IDENTIFIER } from './parser'

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: {} as any,
  utils: {
    unboxing: identity,
  },
}

///

const DATA_STRUCT_CONSTRUCTORS: string[] = [VECTOR_IDENTIFIER, MAP_IDENTIFIER]

export class Interpreter {
  private readonly globals = new Environment()
  private currentEnv: Environment = this.globals
  public readonly options: InterpreterOptions
  private lastLiteral: Literal<any> | undefined = undefined
  private lastPrint: Literal<any> | undefined = undefined

  public constructor(options?: Partial<InterpreterOptions>, literals?: PLLiterals) {
    this.options = { ...defaultOptions, ...options } as any
    const { stdout, globals, lockedGlobals } = this.options
    const plLiterals = { ...defaultLiterals, ...literals }

    Object.keys(plLiterals).forEach((key) => {
      const fn = (plLiterals as any)[key].factory
      const arity = DATA_STRUCT_CONSTRUCTORS.includes(key) ? -1 : fn.length
      this.globals.define(key, simpleFunction(fn, arity))
    })

    this.globals.define(
      'print',
      simpleFunction((arg) => (stdout || console.log)(arg, this.lastPrint?.position), -1),
    )
    this.globals.define('const', constFn)
    this.globals.define('def', def)
    this.globals.define('defn', defn)
    this.globals.define('if', ifFn)
    this.globals.define('case', caseFn)
    this.globals.define('fn', fn)
    this.globals.define('do', doFn)
    this.globals.define('side-effect', sideEffectFn)

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
    this.lastLiteral = program[0]

    try {
      for (const literal of program) {
        this.lastLiteral = literal
        returnVal = this.execLiteral(literal, this.globals)
      }
    } catch (error: any) {
      if (error['king'] === RuntimeError.kind) {
        throw error
      } else {
        throw new RuntimeError(error, this.lastLiteral.position)
      }
    }
    return returnVal
  }

  public execLiteral = (
    literal: Literal<LiteralType>,
    env: Environment,
  ): string | number | boolean | Literal<LiteralType>[] | unknown => {
    this.currentEnv = env
    this.lastLiteral = literal
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

  public evalFn(fn: PLCallable, args: any[]): unknown {
    return fn.call(this, this.currentEnv, args)
  }

  private execList(literal: Literal<LiteralType.List>, env: Environment): unknown {
    const [fnId, ...args] = literal.value
    if (fnId.value === 'print') {
      this.lastPrint = fnId
    }
    const fn: any = this.execLiteral(fnId, env)

    if (typeof fn.call === 'function') {
      return fn.call(this, env, args)
    }
    throw new RuntimeError(`'${fn}' is not a function`, literal.position)
  }

  public getGlobalNames(): string[] {
    return this.globals.getNames()
  }

  public clearEnv(): void {
    if (this.currentEnv.parent !== null) {
      this.currentEnv = this.currentEnv.parent
    }
  }
}
