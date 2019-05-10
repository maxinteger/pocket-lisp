import { Interpreter } from 'interpreter'
import { Literal } from 'parser'

export interface PLCallable {
  call: (interpreter: Interpreter, args: Literal<unknown>[]) => unknown
  arity: () => number
  toString: () => string
}
