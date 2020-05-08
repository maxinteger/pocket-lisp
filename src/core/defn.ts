import { createFunction } from '../dataTypes/PLFunction'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assetParamLength } from '../utils/fn'
import { PLCallable } from '../types'
import { FN_IDENTIFIER } from '../parser'

export const defn = createFunction(
  (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 3)

    const [id, fnArgs, body] = args as [
      Literal<LiteralType.Identifier>,
      Literal<LiteralType.List>,
      Literal<LiteralType>
    ]

    const def = env.get('def') as PLCallable
    return def.call(interpreter, env, [
      id,
      new Literal(LiteralType.List, [FN_IDENTIFIER, fnArgs, body])
    ])
  },
  -1
)
