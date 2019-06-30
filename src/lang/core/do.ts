import { Interpreter } from 'lang/interpreter'
import { Environment } from 'lang/dataTypes/Environment'
import { createFunction } from 'lang/dataTypes/PLFunction'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'
import { assert } from 'lang/utils/fn'

export const doFn = createFunction(
  (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assert(args.length < 1, `Expected at least 1 argument, but got ${args.length}.`)
    return args.map(literal => interpreter.execLiteral(literal, env)).pop()
  },
  -1
)
