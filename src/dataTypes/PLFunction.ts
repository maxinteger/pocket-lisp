import { PLCallable } from '../types'
import { NATIVE_FN_NAME } from '../utils/constants'
import { Interpreter } from '../interpreter'
import { Environment } from './Environment'
import { Literal, LiteralType } from './Literal'
import { assert } from '../utils/fn'

export class PLFunction implements PLCallable {
  static kind = 'Function'
  public constructor(
    private _fn: PLCallable['call'],
    private _arity: number,
    private _resolveIds: boolean = true,
    private _toString: string = NATIVE_FN_NAME,
  ) {}

  public call(interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]): unknown {
    const argDiff = this.arity - args.length
    const argValues = this._resolveIds
      ? (args.map((arg) => (arg.kind === LiteralType.Identifier ? interpreter.execLiteral(arg, env) : arg)) as Literal<
          LiteralType
        >[])
      : args

    if (this.arity === -1 || argDiff === 0) {
      // Function accept arbitrary amount of arguments (-1) or got the right the expected amount  number of args
      return this._fn(interpreter, env, argValues)
    } else if (argDiff > 0) {
      // Got less args -> create a new function with the remaining args
      const curryFn: PLCallable['call'] = (
        interpreter: Interpreter,
        env: Environment,
        argsRest: Literal<LiteralType>[],
      ) => {
        return this._fn(interpreter, env, [...argValues, ...argsRest])
      }
      return new PLFunction(curryFn, argDiff, this._resolveIds, this.toString())
    } else {
      // Got more args
      // the return value must be callable otherwise it will fails
      const result = this._fn(interpreter, env, argValues.slice(0, this.arity))
      if (result instanceof PLFunction) {
        return result.call(interpreter, env, argValues.slice(this.arity))
      } else {
        return assert(true, `Expected ${this.arity} argument${this.arity > 1 ? 's' : ''}, but got ${args.length}.`)
      }
    }
  }

  public get arity(): number {
    return this._arity
  }

  public toString(): string {
    return this._toString === NATIVE_FN_NAME ? NATIVE_FN_NAME : `<${this._toString} function>`
  }

  public toJS(): string {
    return this.toString()
  }

  public debugTypeOf(): string {
    return PLFunction.kind
  }
}

///
interface FunctionOptions {
  fn: PLCallable['call']
  arity: number
  resolveArgsIdentifiers?: boolean
  name?: string
}

export const createFunction = (options: FunctionOptions): PLCallable => {
  return new PLFunction(
    options.fn,
    options.arity,
    options.resolveArgsIdentifiers ?? true,
    options.name || options.fn.name,
  )
}

export const simpleFunction = (fn: (...args: any[]) => any, arity?: number): PLCallable =>
  createFunction({
    name: fn.name,
    arity: arity ?? fn.length,
    fn: (interpreter, env, parameters) => {
      const evaluatedParams = parameters.map((p) => interpreter.execLiteral(p, env), interpreter)
      return fn.apply(interpreter, evaluatedParams)
    },
    resolveArgsIdentifiers: true,
  })
