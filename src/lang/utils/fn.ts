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

export function reduceLiterals<T>(
  literal: Literal<any>,
  fn: (acc: T[], l: Literal<any>) => T[]
): T[] {
  let acc: T[] = []

  const walk = (literal: Literal<any>) => {
    switch (literal.kind) {
      case LiteralType.Boolean:
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.FractionNumber:
      case LiteralType.String:
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return (acc = fn(acc, literal))
      case LiteralType.List:
        (acc = fn(acc, literal))
        return literal.value.map(walk)
    }
  }

  walk(literal)
  return acc
}
