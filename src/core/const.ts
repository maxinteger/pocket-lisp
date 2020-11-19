import { createFunction } from '../dataTypes/PLFunction'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assert } from '../utils/fn'

export const constFn = createFunction({
  name: 'const',
  arity: 1,
  fn: (_interpreter: Interpreter, _env: Environment, args: Literal<LiteralType>[]) => {
    assert(args.length !== 1, `Const expected 1 argument, but got ${args.length}.`)

    const [value] = args

    return createFunction({
      name: 'const',
      arity: -1,
      fn: (interpreter, env) => {
        return interpreter.execLiteral(value, env)
      },
    })
  },
})
