import { PLCallable } from '../types'
import { NATIVE_FN_NAME } from '../utils/constants'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { RuntimeError } from '../dataTypes/RuntimeError'
import { Literal, LiteralType } from '../dataTypes/Literal'

class PLFunction implements PLCallable {
  public constructor(
    private _fn: PLCallable['call'],
    private _arity: number,
    private _toString?: string
  ) {}

  public call(interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]): unknown {
    const argDiff = this.arity - args.length
    if (this.arity === -1 || argDiff === 0) {
      // Function accept arbitrary amount of arguments (-1) or got the right number of args
      return this._fn(interpreter, env, args)
    } else if (argDiff > 0) {
      // Got less args -> create a new function with the remaining args
      const curryFn: PLCallable['call'] = (
        interpreter: Interpreter,
        env: Environment,
        argsRest: Literal<LiteralType>[]
      ) => {
        return this._fn(interpreter, env, [...args, ...argsRest])
      }
      return new PLFunction(curryFn, argDiff, this.toString())
    } else {
      // Got more args
      // the return value must be callable otherwise it will fails
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

export const simpleFunction = (fn: (...args: any[]) => any, arity?: number): PLCallable =>
  createFunction((interpreter, env, parameters) => {
    const evaluatedParams = parameters.map(p => interpreter.execLiteral(p, env), interpreter)
    return fn.apply(interpreter, evaluatedParams)
  }, arity === undefined ? fn.length : arity)
