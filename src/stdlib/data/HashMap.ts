import { Interpreter } from 'interpreter'
import { PLCallable } from 'types'
import { NATIVE_FN_NAME } from '../constants'
import { assert, chunk } from 'stdlib/utils'
import { Literal } from 'parser'

export const HashMap = <PLCallable>{
  call(interpreter: Interpreter, args: Literal<unknown>[]) {
    assert(
      args.length % 2 !== 0,
      `Expected even number of arguments (key, value pairs), but got ${args.length}.`
    )

    const evaluatedParams = args.map(interpreter.execLiteral)

    return chunk(evaluatedParams).reduce((map, [key, value]) => {
      map.set(key, value)
      return map
    }, new Map())
  },
  arity() {
    return -1
  },
  toString() {
    return NATIVE_FN_NAME
  }
}
