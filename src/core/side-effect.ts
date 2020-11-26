import { createFunction, PLFunction } from '../dataTypes/PLFunction'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assert } from '../utils/fn'

export const sideEffectFn = createFunction({
  name: 'side-effect',
  arity: -1,
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assert(args.length < 1, `Eff expected at least 1 argument, but got ${args.length}.`)
    const [fn, ...fnArgs] = args

    const fnEval = interpreter.execLiteral(fn, env)

    assert(!(fnEval instanceof PLFunction), 'Eff first parameter must be a function.')

    return createFunction({
      name: 'side-effect',
      arity: -1,
      fn: (interpreter) => {
        return interpreter.evalFn(fnEval as PLFunction, fnArgs)
      },
    })
  },
})
