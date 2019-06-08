import { PLCallable } from 'lang/types'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { Literal } from 'lang/parser'

class PLFunction implements PLCallable {
  constructor(
    private _fn: PLCallable['call'],
    private _arity: number,
    private _toString?: string
  ) {}

  call(interpreter: Interpreter, env: Environment, args: Literal<unknown>[]): unknown {
    return this._fn(interpreter, env, args)
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
