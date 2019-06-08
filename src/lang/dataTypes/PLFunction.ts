import { PLCallable } from 'lang/types'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { Literal } from 'lang/parser'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'

class PLFunction implements PLCallable {
  constructor(
    private _fn: PLCallable['call'],
    private _arity: number,
    private _toString?: string
  ) {}

  call(interpreter: Interpreter, env: Environment, args: Literal<unknown>[]): unknown {
    const argDiff = this.arity - args.length
    if (this.arity === 0 || argDiff === 0){
      return this._fn(interpreter, env, args)
    } else if (argDiff > 0) {
      const curryFn: PLCallable['call'] = (interpreter: Interpreter, env: Environment, argsRest: Literal<unknown>[]) => {
        return this._fn(interpreter, env, [...args, ...argsRest])
      }
      return new PLFunction(curryFn, argDiff, this.toString())
    } else  {
      throw new RuntimeError(`Expected ${this.arity} argument(s), but got ${args.length}`)
    }
  }

  get arity() {
    return this._arity
  }

  toString() {
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
