import { Interpreter } from '../interpreter'
import { assertParamType, assetParamLength } from '../utils/fn'
import { Environment } from '../dataTypes/Environment'
import { createFunction } from '../dataTypes/PLFunction'
import { Literal, LiteralType } from '../dataTypes/Literal'

export const def = createFunction({
  name: 'def',
  arity: 2,
  resolveArgsIdentifiers: false,
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 2)

    const [id, value] = args as [Literal<LiteralType.Identifier>, Literal<LiteralType>]
    assertParamType(id, LiteralType.Identifier)

    const evaluatedValue = interpreter.execLiteral(value, env)

    env.define(id.value, evaluatedValue)
    return evaluatedValue
  },
})
