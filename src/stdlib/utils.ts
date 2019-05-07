import { PLCallable } from '../types'
import { Interpreter } from '../interpreter'
import { NATIVE_FN_NAME } from './constants'
import { Literal, LiteralType } from '../parser'
import { RuntimeError } from '../dataTypes/RuntimeError'

///

export const nativeFn = (fn: (...args: any[]) => any): PLCallable =>
  <PLCallable>{
    call(interpreter: Interpreter, parameters: any[]) {
      const evaluatedParams = parameters.map(interpreter.execLiteral, interpreter)
      return fn.apply(null, evaluatedParams)
    },
    arity() {
      return fn.length
    },
    toString() {
      return NATIVE_FN_NAME
    }
  }

///

export const assetParamLength = (args: any[], expected: number, msg?: string) => {
  if (args.length !== expected)
    throw new RuntimeError(msg || `Expected ${expected} argument(s), but got ${args.length}`)
}

export const assertParamType = (literal: Literal<any>, type: LiteralType, msg?: string) => {
  if (literal.kind !== type)
    throw new RuntimeError(
      msg || `Invalid function parameter, actual: '${literal.kind}', expected: '${type}'`
    )
}
