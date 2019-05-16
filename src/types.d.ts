import { Interpreter } from 'interpreter'
import { Literal } from 'parser'

declare interface PLCallable {
  call: (interpreter: Interpreter, args: Literal<unknown>[]) => unknown
  arity: () => number
  toString: () => string
}


declare interface PLLiteral {
  parser: (x: string) => any
  factory: PLCallable
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
  vector: PLLiteral
  hashMap: PLLiteral
}
