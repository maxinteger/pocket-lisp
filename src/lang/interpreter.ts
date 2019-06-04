import { Environment } from 'lang/dataTypes/Environment'
import { Literal, LiteralType } from 'lang/parser'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { InterpreterOptions, PLCallable, PLLiterals } from 'lang/types'
import { defaultLiterals } from 'lang/utils/defaultLiterals'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { simpleFn } from 'lang/utils/fn'
import { def } from 'lang/core/def'
import { ifFn } from 'lang/core/if'

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: <any>{}
}

///

export class Interpreter {
  private readonly globals = new Environment()

  constructor(options?: InterpreterOptions, literals?: PLLiterals) {
    const { stdout, globals, lockedGlobals } = { ...defaultOptions, ...options }
    const plLiterals = { ...defaultLiterals, ...literals }

    Object.keys(plLiterals).forEach(key => {
      this.globals.define(key, simpleFn((plLiterals as any)[key].factory))
    })

    this.globals.define('print', simpleFn(stdout || console.log))
    this.globals.define('def', def)
    this.globals.define('if', ifFn)

    Object.keys(globals).forEach(key => {
      const value = globals[key]
      const fn = value.toString() === NATIVE_FN_NAME ? value : simpleFn(value)
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
    if (fnId.kind === LiteralType.Identifier) {
      const fn = <PLCallable>env.get((fnId as Literal<string>).value)
      return fn.call(this, env, args)
    }
    throw new RuntimeError(`'${fnId.value}' is not a function`)
  }
}
