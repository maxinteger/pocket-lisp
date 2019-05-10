import { PLCallable } from 'types'
import { NATIVE_FN_NAME } from './constants'
import { Interpreter } from 'interpreter'
import { Literal } from 'parser'

export abstract class NativeFn implements PLCallable {
  abstract arity(): number
  abstract call(interpreter: Interpreter, args: Literal<unknown>[]): unknown
  toString() {
    return NATIVE_FN_NAME
  }
}
