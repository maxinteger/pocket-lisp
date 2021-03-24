import { Interpreter } from './interpreter'
import { Environment } from './dataTypes/Environment'
import { Literal, LiteralType } from './dataTypes/Literal'
import { SnippetPosition } from './dataTypes/SnippetPosition'

export interface PLCallable {
  call: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => unknown
  arity: number
  toString: () => string
  toJS: () => string
  debugTypeOf: () => string
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
  factory: any // TODO: fix type
}

export interface InterpreterOptions {
  globals: { [key: string]: any }
  stdout: (out: string, position?: SnippetPosition) => void
  lockedGlobals: boolean
  utils: {
    unboxing: (x: any) => any
  }
}

export interface PLLiterals {
  Bool: PLLiteral
  Int: PLLiteral
  Float: PLLiteral
  FractionNumber: PLLiteral
  String: PLLiteral
  Vector: PLLiteral
  HashMap: PLLiteral
}
