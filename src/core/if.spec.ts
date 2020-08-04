import { expect } from 'chai'
import { initInterpret } from '../../test/testUtils'
import { NATIVE_FN_NAME } from '../utils/constants'
import { ifFn } from '.'

describe('stdlib/core/if', () => {
  it('should fail it parameter number is more then 3', () => {
    expect(() => initInterpret('(if true 1 2 4)', { if: ifFn })).throw(
      'Expected 3 argument(s), but got 4'
    )
  })

  it("should throw error if the first expression's result is not boolean", () => {
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
    expect(ifFn.arity).equals(3)
  })

  it('should has native toString', () => {
    expect(ifFn.toString()).equals(NATIVE_FN_NAME)
  })
})