import { Interpreter } from 'lang/interpreter'
import { Literal, LiteralType } from 'lang/parser'
import { assertParamType, assetParamLength, createFn } from 'lang/utils/fn'
import { Environment } from 'lang/dataTypes/Environment'

export const def = createFn(
  (interpreter: Interpreter, env: Environment, args: Literal<unknown>[]) => {
    assetParamLength(args, 2)

    const [id, value] = args
    assertParamType(id, LiteralType.Identifier)

    const evaluatedValue = interpreter.execLiteral(value, env)

    env.define((id as Literal<string>).value, evaluatedValue)
    return evaluatedValue
  },
  2
)
