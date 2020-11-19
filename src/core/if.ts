import { Interpreter } from '../interpreter'
import { assetParamLength } from '../utils/fn'
import { RuntimeError } from '../dataTypes/RuntimeError'
import { Environment } from '../dataTypes/Environment'
import { createFunction } from '../dataTypes/PLFunction'
import { Literal, LiteralType } from '../dataTypes/Literal'

export const ifFn = createFunction({
  name: 'if',
  arity: 3,
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 3)

    const [condition, thenBranch, elseBranch] = args

    const conditionEval = interpreter.execLiteral(condition, env)
    const conditionRes = interpreter.options.utils.unboxing(conditionEval)

    if (conditionRes === true) {
      return interpreter.execLiteral(thenBranch, env)
    }

    if (conditionRes === false) {
      return interpreter.execLiteral(elseBranch, env)
    }

    throw new RuntimeError(`Expected boolean value in the if condition, but get '${conditionRes}'`)
  },
})
