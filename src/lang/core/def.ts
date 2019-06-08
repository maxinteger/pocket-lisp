import { Interpreter } from 'lang/interpreter'
import { Literal, LiteralType } from 'lang/parser'
import { assertParamType, assetParamLength} from 'lang/utils/fn'
import { Environment } from 'lang/dataTypes/Environment'
import { createFunction } from 'lang/dataTypes/PLFunction'

export const def = createFunction(
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
