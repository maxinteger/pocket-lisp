import { Interpreter } from 'lang/interpreter'
import { assertParamType, assetParamLength } from 'lang/utils/fn'
import { Environment } from 'lang/dataTypes/Environment'
import { createFunction } from 'lang/dataTypes/PLFunction'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'

export const def = createFunction(
  (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 2)

    const [id, value] = args as [Literal<LiteralType.Identifier>, Literal<LiteralType>]
    assertParamType(id, LiteralType.Identifier)

    const evaluatedValue = interpreter.execLiteral(value, env)

    env.define(id.value, evaluatedValue)
    return evaluatedValue
  },
  2
)
