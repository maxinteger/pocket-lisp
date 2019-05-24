import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Literal, LiteralType } from 'lang/parser'
import { PLCallable } from 'lang/types'
import { Interpreter } from 'lang/interpreter'
import { NATIVE_FN_NAME } from 'lang/utils/constants'

export const identity: <T>(x: T) => T = x => x

export const always: <T>(x: T) => () => T = x => () => x

export const assert = (val: boolean, msg: string) => {
  if (val) throw new RuntimeError(msg)
  return true
}

export const assetParamLength = (args: any[], expected: number, msg?: string) =>
  assert(
    args.length !== expected,
    msg || `Expected ${expected} argument(s), but got ${args.length}`
  )

export const assertParamType = (literal: Literal<unknown>, ...types: LiteralType[]) =>
  assert(
    types.find(t => t === literal.kind) === undefined,
    `Invalid function parameter, actual: '${literal.kind}', expected: '${types.join(' or ')}'`
  )

export const nativeFn = (fn: (...args: any[]) => any): PLCallable =>
  <PLCallable>{
    call(interpreter: Interpreter, parameters: Literal<unknown>[]) {
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
