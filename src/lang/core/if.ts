import { Interpreter } from 'lang/interpreter'
import { Literal } from 'lang/parser'
import { assetParamLength, createFn } from 'lang/utils/fn'
import { toJS } from 'stdlib/types'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Environment } from 'lang/dataTypes/Environment'

export const ifFn = createFn(
  (interpreter: Interpreter, env: Environment, args: Literal<unknown>[]) => {
    assetParamLength(args, 3)

    const [condition, thenBranch, elseBranch] = args

    // TODO fix default list vs std lib differences
    const conditionEval = interpreter.execLiteral(condition, env)
    const conditionRes = conditionEval[toJS] ? conditionEval[toJS]() : conditionEval

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
