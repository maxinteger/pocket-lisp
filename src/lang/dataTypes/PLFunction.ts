import { PLCallable } from 'lang/types'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'

class PLFunction implements PLCallable {
  public constructor(
    private _fn: PLCallable['call'],
    private _arity: number,
    private _toString?: string
  ) {}

  public call(interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]): unknown {
    const argDiff = this.arity - args.length
    if (this.arity === 0 || argDiff === 0) {
      return this._fn(interpreter, env, args)
    } else if (argDiff > 0) {
      const curryFn: PLCallable['call'] = (
        interpreter: Interpreter,
        env: Environment,
        argsRest: Literal<LiteralType>[]
      ) => {
        return this._fn(interpreter, env, [...args, ...argsRest])
      }
      return new PLFunction(curryFn, argDiff, this.toString())
    } else {
      const result = this._fn(interpreter, env, args.slice(0, this.arity))
      if (result instanceof PLFunction) {
        return result.call(interpreter, env, args.slice(this.arity))
      } else {
        throw new RuntimeError(`Expected ${this.arity} argument(s), but got ${args.length}`)
      }
    }
  }

  public get arity() {
    return this._arity
  }

  public toString() {
    return this._toString || NATIVE_FN_NAME
  }
}

///

export const createFunction = (
  fn: PLCallable['call'],
  arity: number,
  representation?: string
): PLCallable => {
  return new PLFunction(fn, arity, representation)
}

export const simpleFunction = (fn: (...args: any[]) => any): PLCallable =>
  createFunction((interpreter, env, parameters) => {
    const evaluatedParams = parameters.map(p => interpreter.execLiteral(p, env), interpreter)
    return fn.apply(null, evaluatedParams)
  }, fn.length)
