import { Interpreter } from './interpreter'
import { Environment } from './dataTypes/Environment'
import { Literal, LiteralType } from './dataTypes/Literal'

export interface PLCallable {
  call: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => unknown
  arity: number
  toString: () => string
}

export interface PrimitiveLiteralParseFn {
  (str: string): any
}

export interface LiteralFactoryFn<T, R> {
  (a: T): R
  (a: T, b: T): R
}

export interface PLLiteral {
  parser: PrimitiveLiteralParseFn
  factory: any // TODO: fix factory type
}

export interface InterpreterOptions {
  globals: { [key: string]: any }
  stdout: (out: string) => void
  lockedGlobals: boolean
  utils: {
    unboxing: (x: any) => any
  }
}

export interface PLLiterals {
  bool: PLLiteral
  int: PLLiteral
  float: PLLiteral
  fractionNumber: PLLiteral
  string: PLLiteral
  vector: PLLiteral
  hashMap: PLLiteral
}
