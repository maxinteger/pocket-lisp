import { Interpreter } from 'lang/interpreter'
import { Literal, LiteralType } from 'lang/parser'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { PLCallable } from 'lang/types'
import { assertParamType, assetParamLength } from 'lang/utils/fn'

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
