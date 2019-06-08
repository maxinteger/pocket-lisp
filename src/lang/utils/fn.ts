import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Literal, LiteralType } from 'lang/parser'

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
