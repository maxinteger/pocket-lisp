import { createFunction, PLFunction } from '../dataTypes/PLFunction'
import { Interpreter } from '../interpreter'
import { Environment } from '../dataTypes/Environment'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { assert, assertParamType, assetParamLength } from '../utils/fn'

export const caseFn = createFunction({
  arity: -1,
  name: 'case',
  fn: (interpreter: Interpreter, env: Environment, args: Literal<LiteralType>[]) => {
    assert(args.length < 2, `Case expected at least 2 argument, but got ${args.length}.`)

    const [condition, ...cases] = args as [Literal<any>, ...Literal<LiteralType>[]]

    const conditionValue = interpreter.execLiteral(condition, env) as any

    for (const caseBranch of cases as Literal<LiteralType>[]) {
      assertParamType(caseBranch, LiteralType.List)

      const listContent = caseBranch.value as Literal<LiteralType>[]
      assetParamLength(listContent, 2, `Case branch expected list with ${2} items, but got ${listContent.length}`)

      const [caseLiteral, caseResult] = listContent
      const caseFn = interpreter.execLiteral(caseLiteral, env) as any

      const unboxedCaseFn = interpreter.options.utils.unboxing(caseFn)
      assert(
        !(unboxedCaseFn === 'else' || caseFn instanceof PLFunction),
        'Case branch must start with a function or :else.',
      )

      let caseValue = false
      if (unboxedCaseFn === 'else') {
        caseValue = true
      } else {
        const caseFnValue = interpreter.evalFn(caseFn as PLFunction, [conditionValue])
        const caseFnValueUB = interpreter.options.utils.unboxing(caseFnValue)
        assert(!(typeof caseFnValueUB === 'boolean'), 'Case branch function must return with Bool.')
        caseValue = caseFnValueUB as boolean
      }

      if (caseValue) {
        return interpreter.execLiteral(caseResult, env)
      }
    }

    assert(true, `At least one of the case branch must match with the condition: ${conditionValue}`)
  },
})
