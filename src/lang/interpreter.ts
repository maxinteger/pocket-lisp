import { Environment } from 'lang/dataTypes/Environment'
import { Literal, LiteralType } from 'lang/parser'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { InterpreterOptions, PLLiterals } from 'lang/types'
import { defaultLiterals } from 'lang/utils/defaultLiterals'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { def, fn, ifFn } from 'lang/core'
import { simpleFunction } from 'lang/dataTypes/PLFunction'
import { identity } from 'lang/utils/fn'

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: <any>{},
  utils: {
    unboxing: identity
  }
}

///

export class Interpreter {
  private readonly globals = new Environment()
  public readonly options: InterpreterOptions

  constructor(options?: Partial<InterpreterOptions>, literals?: PLLiterals) {
    this.options = { ...defaultOptions, ...options } as any
    const { stdout, globals, lockedGlobals } = this.options
    const plLiterals = { ...defaultLiterals, ...literals }

    Object.keys(plLiterals).forEach(key => {
      this.globals.define(key, simpleFunction((plLiterals as any)[key].factory))
    })

    this.globals.define('print', simpleFunction(stdout || console.log))
    this.globals.define('def', def)
    this.globals.define('if', ifFn)
    this.globals.define('fn', fn)

    Object.keys(globals).forEach(key => {
      const value = globals[key]
      const fn = value.toString() === NATIVE_FN_NAME ? value : simpleFunction(value)
      this.globals.define(key, fn, lockedGlobals)
    })
  }

  public interpret(program: Literal<unknown>[]) {
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

  public execLiteral = (literal: Literal<any>, env: Environment) => {
    switch (literal.kind) {
      case LiteralType.Boolean:
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.FractionNumber:
      case LiteralType.String:
        return literal.value
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return env.get(literal.value)
      case LiteralType.List:
        return this.execList(literal, env)
    }
  }

  private execList(literal: Literal<Literal<unknown>[]>, env: Environment): unknown {
    const [fnId, ...args] = literal.value
    const fn: any = this.execLiteral(fnId, env)

    if (typeof fn.call === 'function') {
      return fn.call(this, env, args)
    }
    throw new RuntimeError(`'${fn}' is not a function`)
  }
}
