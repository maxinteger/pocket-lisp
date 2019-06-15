import { Interpreter } from 'lang/interpreter'
import { assetParamLength } from 'lang/utils/fn'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Environment } from 'lang/dataTypes/Environment'
import { createFunction } from 'lang/dataTypes/PLFunction'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'

export const ifFn = createFunction(
  (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assetParamLength(args, 3)

    const [condition, thenBranch, elseBranch] = args

    // TODO fix default list vs std lib differences
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
  3
)
