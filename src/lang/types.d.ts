import { Interpreter } from 'lang/interpreter'
import { Literal } from 'lang/parser'
import { Environment } from 'lang/dataTypes/Environment'

declare interface PLCallable {
  call: (interpreter: Interpreter, env: Environment, args: Literal<unknown>[]) => unknown
  arity: number
  toString: () => string
}

declare interface PrimitiveLiteralParseFn {
  (str: string): unknown
}

declare interface LiteralFactoryFn<T, R> {
  (a: T): R
  (a: T, b: T): R
}

declare interface PLLiteral {
  parser?: PrimitiveLiteralParseFn
  factory: any // TODO: fix factory type
}

declare interface InterpreterOptions {
  globals?: { [key: string]: any }
  stdout?: (out: string) => void
  lockedGlobals?: boolean
}

declare interface PLLiterals {
  bool: PLLiteral
  int: PLLiteral
  float: PLLiteral
  fractionNumber: PLLiteral
  string: PLLiteral
  vector: PLLiteral
  hashMap: PLLiteral
}
