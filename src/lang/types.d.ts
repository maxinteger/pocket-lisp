import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'

declare interface PLCallable {
  call: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => unknown
  arity: number
  toString: () => string
}

declare interface PrimitiveLiteralParseFn {
  (str: string): any
}

declare interface LiteralFactoryFn<T, R> {
  (a: T): R
  (a: T, b: T): R
}

declare interface PLLiteral {
  parser: PrimitiveLiteralParseFn
  factory: any // TODO: fix factory type
}

declare interface InterpreterOptions {
  globals: { [key: string]: any }
  stdout: (out: string) => void
  lockedGlobals: boolean
  utils: {
    unboxing: (x: any) => any
  }
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
