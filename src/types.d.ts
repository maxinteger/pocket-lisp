import { Interpreter } from './interpreter'
import { Literal } from './parser'

export interface PLCallable {
  call: (interpreter: Interpreter, args: Literal<any>[]) => any
  arity: () => number
  toString: () => string
}
