import { Interpreter } from '../../interpreter'
import { assertParamType, assetParamLength } from '../utils'
import { LiteralType } from '../../parser'
import { PLCallable } from '../../types'
import { NATIVE_FN_NAME } from '../constants'

export const def = <PLCallable>{
  call(interpreter: Interpreter, args: any[]) {
    assetParamLength(args, 2)

    const [id, value] = args
    assertParamType(id, LiteralType.Identifier)

    const evaluatedValue = interpreter.execLiteral(value)

    interpreter.currentEnv.define(id.value, evaluatedValue)
  },
  arity() {
    return 2
  },
  toString() {
    return NATIVE_FN_NAME
  }
}
