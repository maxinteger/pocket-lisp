import { Interpreter } from 'interpreter'
import { PLCallable } from 'types'
import { NATIVE_FN_NAME } from '../constants'

export const vector = <PLCallable>{
  call(interpreter: Interpreter, args: any[]) {
    return args.map(interpreter.execLiteral)
  },
  arity() {
    return -1
  },
  toString() {
    return NATIVE_FN_NAME
  }
}
