import { Environment } from './dataTypes/Environment'
import { PLCallable } from './types'
import { Literal, LiteralType } from './parser'
import { RuntimeError } from './dataTypes/RuntimeError'

export interface InterpreterOptions {
  globals?: { [key: string]: any }
}

export class Interpreter {
  private readonly globals = new Environment()
  private currentEnv = this.globals

  constructor(options?: InterpreterOptions) {
    this.globals.define('print', nativeFn(console.log))
    this.globals.define('+', nativeFn((a, b) => a + b))

    if (options) {
      const globals = options.globals || {}
      Object.keys(globals).forEach(key => this.globals.define(key, globals[key]))
    }
  }

  interpret(program: Literal<any>[]) {
    let returnVal: any = undefined
    try {
      for (let literal of program) {
        this.execLiteral(literal)
      }
    } catch (e) {
      throw new RuntimeError(e)
    }
    return returnVal
  }

  private execLiteral(literal: Literal<any>) {
    switch (literal.kind) {
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.Fraction:
      case LiteralType.String:
      case LiteralType.Array:
        return literal.value
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return this.currentEnv.get(literal.value)
      case LiteralType.List:
        return this.execList(literal)
    }
  }

  private execList(literal: Literal<Literal<any>[]>): any {
    const [fnId, ...args] = literal.value
    if (fnId.kind === LiteralType.Identifier) {
      const fn = this.currentEnv.get(fnId.value)
      return fn.call(this, args.map(this.execLiteral, this))
    }
    throw new RuntimeError(`'${fnId.value}' is not a function`)
  }
}

///

export const nativeFn = (fn: (...args: any[]) => any): PLCallable =>
  <PLCallable>{
    // @ts-ignore
    call(interpreter: Interpreter, parameters: any[]) {
      return fn(...parameters)
    },
    arity() {
      return fn.length
    },
    toString() {
      return '<native fn>'
    }
  }
