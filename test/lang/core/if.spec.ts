import { expect } from 'chai'
import { initInterpret } from '../../testUtils'
import { def } from 'lang/core/def'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { ifFn } from 'lang/core/if'

describe('stdlib/core/if', () => {
  it('should fail it parameter number is less or more then 3', () => {
    expect(() => initInterpret('(if x)', { if: ifFn })).throw('Expected 3 argument(s), but got 1')
    expect(() => initInterpret('(if x 2)', { if: ifFn })).throw('Expected 3 argument(s), but got 2')
    expect(() => initInterpret('(if x 1 2 4)', { if: ifFn })).throw(
      'Expected 3 argument(s), but got 4'
    )
  })

  it("should throw error if the firs expression's result is not boolean", () => {
    expect(() => initInterpret('(if 1 "a" "b")', { if: ifFn })).throw(
      "Expected boolean value in the if condition, but get '1'"
    )
    expect(() => initInterpret('(if "x" "a" "b")', { if: ifFn })).throw(
      "Expected boolean value in the if condition, but get 'x'"
    )
  })

  it('should evaluate the then branch if the condition is true', () => {
    initInterpret(`(print (if true 1 2))`, {
      if: ifFn,
      print: (output: any) => expect(output).equals(1)
    })
  })

  it('should evaluate the then branch if the condition is false', () => {
    initInterpret(`(print (if false 1 2))`, {
      if: ifFn,
      print: (output: any) => expect(output).equals(2)
    })
  })

  it('should has arity 3', () => {
    expect(ifFn.arity()).equals(3)
  })

  it('should has native toString', () => {
    expect(ifFn.toString()).equals(NATIVE_FN_NAME)
  })
})
