import { initInterpret } from '../../test/testUtils'
import { def } from './def'

describe('stdlib/core/def', () => {
  it('should fail it parameter number or more then 2', () => {
    expect(() => initInterpret('(def x 1 2)', { def })).toThrow('Expected 2 arguments, but got 3.')
  })

  it('should throw error if the first parameter is not identifier', () => {
    expect(() => initInterpret('(def 1 42)', { def })).toThrow(
      "Invalid function parameter, actual: 'int', expected: 'identifier'",
    )
    expect(() => initInterpret('(def "x" 42)', { def })).toThrow(
      "Invalid function parameter, actual: 'string', expected: 'identifier'",
    )
  })

  it('should define new variable', () => {
    initInterpret(
      `
		(def x 42)
		(print x)
		`,
      { def, print: (output: any) => expect(output).toBe(42) },
    )
  })

  it('should has arity 2', () => {
    expect(def.arity).toBe(2)
  })

  it('should has native toString', () => {
    expect(def.toString()).toBe('<def function>')
    expect(def.toJS()).toBe('<def function>')
    expect(def.debugTypeOf()).toBe('Function')
  })
})
