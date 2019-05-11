import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { def } from 'stdlib/core/def'
import { nativeFn } from 'stdlib/utils'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/def', () => {
  it('should fail it parameter number is less or more then 2', () => {
    expect(() => initInterpret('(def x)', { def })).throw('Expected 2 argument(s), but got 1')
    expect(() => initInterpret('(def x 1 2)', { def })).throw('Expected 2 argument(s), but got 3')
  })

  it('should throw error if the second parameter is not identifier', () => {
    expect(() => initInterpret('(def 1 42)', { def })).throw(
      "Invalid function parameter, actual: 'int', expected: 'identifier'"
    )
    expect(() => initInterpret('(def "x" 42)', { def })).throw(
      "Invalid function parameter, actual: 'string', expected: 'identifier'"
    )
  })

  it('should define new variable', () => {
    initInterpret(
      `
		(def x 42)
		(print x)
		`,
      { def, print: nativeFn(output => expect(output).equals(42)) }
    )
  })

  it('should has arity -1', () => {
    expect(def.arity()).equals(2)
  })

  it('should has native toString', () => {
    expect(def.toString()).equals(NATIVE_FN_NAME)
  })
})
