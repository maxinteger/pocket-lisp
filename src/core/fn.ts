import { Interpreter } from '../interpreter'
import { assertParamType, assetParamLength } from '../utils/fn'
import { Environment } from '../dataTypes/Environment'
import { createFunction } from '../dataTypes/PLFunction'
import { Literal, LiteralType } from '../dataTypes/Literal'

export const fn = createFunction({
  name: 'fn',
  arity: -1,
  resolveArgsIdentifiers: false,
  fn: (_interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 2)

    const [fnArgNamesList, fnBody] = args as Literal<LiteralType.List>[]

    assertParamType(fnArgNamesList, LiteralType.List)

    const fnArgNames = fnArgNamesList.value.slice(1) as Literal<LiteralType.Identifier>[]
    fnArgNames.map((id) => assertParamType(id, LiteralType.Identifier))

    return createFunction({
      name: 'lambda',
      arity: fnArgNames.length,
      fn: (interpreter: Interpreter, callEnv: Environment, fnArgs: Literal<LiteralType>[]) => {
        assetParamLength(fnArgs, fnArgNames.length)

        const closure = new Environment(env)

        fnArgNames.forEach((id, idx) => {
          const arg = interpreter.execLiteral(fnArgs[idx], callEnv)
          closure.define(id.value, arg)
        })

        const result = interpreter.execLiteral(fnBody, closure)
        interpreter.clearEnv()
        return result
      },
    })
  },
})
