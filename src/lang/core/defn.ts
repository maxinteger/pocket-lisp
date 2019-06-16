import { createFunction } from 'lang/dataTypes/PLFunction'
import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'
import { assetParamLength } from 'lang/utils/fn'
import { PLCallable } from 'lang/types'
import { FN_IDENTIFIER } from 'lang/parser'

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
			new Literal(LiteralType.List, [
				FN_IDENTIFIER,
				fnArgs,
				body
			])
		])
  },
  0
)
