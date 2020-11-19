import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { createFunction } from '../dataTypes/PLFunction'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assert } from '../utils/fn'

export const doFn = createFunction({
  name: 'do',
  arity: -1,
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assert(args.length < 1, `Expected at least 1 argument, but got ${args.length}.`)
    return args.map((literal) => interpreter.execLiteral(literal, env)).pop()
  },
})
