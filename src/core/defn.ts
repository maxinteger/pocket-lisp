import { createFunction } from '../dataTypes/PLFunction'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assetParamLength } from '../utils/fn'
import { PLCallable } from '../types'
import { FN_IDENTIFIER } from '../parser'
import { SnippetPosition } from '../dataTypes/SnippetPosition'

export const defn = createFunction({
  name: 'defn',
  arity: -1,
  resolveArgsIdentifiers: false,
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 3)

    const [id, fnArgs, body] = args as [
      Literal<LiteralType.Identifier>,
      Literal<LiteralType.List>,
      Literal<LiteralType>,
    ]

    const def = env.get('def') as PLCallable
    return def.call(interpreter, env, [
      id,
      new Literal(
        LiteralType.List,
        [new Literal(LiteralType.Identifier, FN_IDENTIFIER, SnippetPosition.unknown), fnArgs, body],
        SnippetPosition.unknown,
      ),
    ])
  },
})
