import { Interpreter } from 'interpreter'
import { assertParamType, assetParamLength } from '../utils'
import { Literal, LiteralType } from 'parser'
import { PLCallable } from 'types'
import { NATIVE_FN_NAME } from '../constants'

export const def = <PLCallable>{
  call(interpreter: Interpreter, args: Literal<unknown>[]) {
    assetParamLength(args, 2)

    const [id, value] = args
    assertParamType(id, LiteralType.Identifier)

    const evaluatedValue = interpreter.execLiteral(value)

    interpreter.currentEnv.define((id as Literal<string>).value, evaluatedValue)
  },
  arity() {
    return 2
  },
  toString() {
    return NATIVE_FN_NAME
  }
}
