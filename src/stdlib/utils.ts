import { PLCallable } from 'types'
import { Interpreter } from 'interpreter'
import { NATIVE_FN_NAME } from './constants'
import { Literal, LiteralType } from 'parser'
import { RuntimeError } from 'dataTypes/RuntimeError'

///

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

///

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

export const assertType = (a: any, b: any) =>
  assert(
    a.constructor !== b.constructor,
    `Type mismatch between: '${a.constructor && a.constructor.name}' and '${b.constructor &&
      b.constructor.name}'`
  )

export const checkType = (type: any, value: any) =>
  assert(
    type !== value.constructor,
    `Expected '${type.name}', but got '${value.constructor.name}'.`
  )

export const chunk = (ary: any[], chunkSize = 2) => {
  const newAry = []
  const end = ary.length
  for (let i = 0; i < end; i += chunkSize) {
    newAry.push(ary.slice(i, i + chunkSize))
  }
  return newAry
}
