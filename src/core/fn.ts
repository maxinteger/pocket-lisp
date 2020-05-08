import { Interpreter } from '../interpreter'
import { LAMBDA_FN_NAME } from '../utils/constants'
import { assertParamType, assetParamLength } from '../utils/fn'
import { Environment } from '../dataTypes/Environment'
import { createFunction } from '../dataTypes/PLFunction'
import { Literal, LiteralType } from '../dataTypes/Literal'

export const fn = createFunction(
  (_interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 2)

    const [fnArgNamesList, fnBody] = args as Literal<LiteralType.List>[]

    assertParamType(fnArgNamesList, LiteralType.List)

    const fnArgNames = fnArgNamesList.value.slice(1) as Literal<LiteralType.Identifier>[]
    fnArgNames.map(id => assertParamType(id, LiteralType.Identifier))

    return createFunction(
      (interpreter: Interpreter, callEnv: Environment, fnArgs: Literal<LiteralType>[]) => {
        assetParamLength(fnArgs, fnArgNames.length)

        const closure = new Environment(env)

        fnArgNames.forEach((id, idx) => {
          const arg = interpreter.execLiteral(fnArgs[idx], callEnv)
          closure.define(id.value, arg)
        })

        return interpreter.execLiteral(fnBody, closure)
      },
      fnArgNames.length,
      LAMBDA_FN_NAME
    )
  },
  -1
)
