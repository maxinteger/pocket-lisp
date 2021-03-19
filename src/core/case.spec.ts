import { initInterpret } from '../../test/testUtils'
import { caseFn } from './case'
import { def } from './def'

describe('stdlib/core/case', () => {
  it('should fails when got less then 2 parameters', () => {
    expect(() => initInterpret('(case 1)', { case: caseFn })).toThrow('Case expected at least 2 argument, but got 1.')
  })

  it('should return with the value of the matched case branch', () => {
    expect(
      initInterpret('(def a (case 1 ((== 1) "a") ((== 2) "b"))) (print a)', {
        case: caseFn,
        ['==']: (a: unknown, b: unknown) => a === b,
        def: def,
        print: (output: any) => expect(output).toBe('a'),
      }),
    )
  })

  it('should work with numeric condition', () => {
    expect(
      initInterpret('(print (case 1 ((== 1) "a") ((== 2) "b")))', {
        case: caseFn,
        ['==']: (a: unknown, b: unknown) => a === b,
        print: (output: any) => expect(output).toBe('a'),
      }),
    )
  })

  it('should work with string condition', () => {
    expect(
      initInterpret('(print (case "b" ((== "a") 1) ((== "b") 2)))', {
        case: caseFn,
        ['==']: (a: unknown, b: unknown) => a === b,
        print: (output: any) => expect(output).toBe(2),
      }),
    )
  })

  it('should return with ":else" branch if it exists', () => {
    expect(
      initInterpret('(print (case "x" ((== "a") 1) (:else 99) ((=== "b") 2)))', {
        case: caseFn,
        ['==']: (a: unknown, b: unknown) => a === b,
        print: (output: any) => expect(output).toBe(99),
      }),
    )
  })

  it('should fail if non of the branches are match', () => {
    expect(() =>
      initInterpret('(case "x" ((== "a") 1) ((== "b") 2))', {
        ['==']: (a: unknown, b: unknown) => a === b,
        case: caseFn,
      }),
    ).toThrow('At least one of the case branch must match with the condition: ')
  })
  it('should has arity infinite', () => {
    expect(caseFn.arity).toBe(-1)
  })

  it('should has native toString', () => {
    expect(caseFn.toString()).toBe('<case function>')
    expect(caseFn.toJS()).toBe('<case function>')
    expect(caseFn.debugTypeOf()).toBe('Function')
  })
})
