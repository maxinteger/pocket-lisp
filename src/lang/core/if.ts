import { Interpreter } from 'lang/interpreter'
import { Literal } from 'lang/parser'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { PLCallable } from 'lang/types'
import { assetParamLength } from 'lang/utils/fn'
import { toJS } from 'stdlib/types'
import { RuntimeError } from 'lang/dataTypes/RuntimeError'

export const ifFn = <PLCallable>{
  call(interpreter: Interpreter, args: Literal<unknown>[]) {
    assetParamLength(args, 3)

    const [condition, thenBranch, elseBranch] = args

    // TODO fix default list vs std lib differences
    const conditionEval = interpreter.execLiteral(condition)
    const conditionRes = conditionEval[toJS] ? conditionEval[toJS]() : conditionEval

    if (conditionRes === true) {
      return interpreter.execLiteral(thenBranch)
    }

    if (conditionRes === false) {
      return interpreter.execLiteral(elseBranch)
    }

    throw new RuntimeError(`Expected boolean value in the if condition, but get '${conditionRes}'`)
  },
  arity() {
    return 3
  },
  toString() {
    return NATIVE_FN_NAME
  }
}
