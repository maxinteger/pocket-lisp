import { RuntimeError } from '../dataTypes/RuntimeError'
import { Literal, LiteralType } from '../dataTypes/Literal'

export const identity: <T>(x: T) => T = (x) => x

export const assert = (val: boolean, msg: string): boolean => {
  if (val) throw new RuntimeError(msg)
  return true
}

export const assetParamLength = (args: unknown[], expected: number, msg?: string): boolean =>
  assert(
    args.length !== expected,
    msg || `Expected ${expected} argument${expected > 1 ? 's' : ''}, but got ${args.length}.`,
  )

export const assertParamType = (literal: Literal<any>, ...types: LiteralType[]): boolean =>
  assert(
    types.find((t) => t === literal.kind) === undefined,
    `Invalid function parameter, actual: '${literal.kind}', expected: '${types.join(' or ')}'.`,
  )

export function reduceLiterals<T>(literal: Literal<LiteralType>, fn: (acc: T[], l: Literal<LiteralType>) => T[]): T[] {
  let acc: T[] = []

  const walk = (literal: Literal<LiteralType>) => {
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
        ;(literal as Literal<LiteralType.List>).value.map(walk)
        return (acc = fn(acc, literal))
    }
  }

  walk(literal)
  return acc
}
