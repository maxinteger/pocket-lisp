import { initInterpret } from '../../test/testUtils'
import { ifFn } from '.'

describe('stdlib/core/if', () => {
  it('should fail it parameter number is more then 3', () => {
    expect(() => initInterpret('(if true 1 2 4)', { if: ifFn })).toThrow('Expected 3 arguments, but got 4.')
  })

  it("should throw error if the first expression's result is not boolean", () => {
    expect(() => initInterpret('(if 1 "a" "b")', { if: ifFn })).toThrow(
      "Expected boolean value in the if condition, but get '1'",
    )
    expect(() => initInterpret('(if "x" "a" "b")', { if: ifFn })).toThrow(
      "Expected boolean value in the if condition, but get 'x'",
    )
  })

  it('should evaluate the then branch if the condition is true', () => {
    initInterpret(`(print (if true 1 2))`, {
      if: ifFn,
      print: (output: any) => expect(output).toBe(1),
    })
  })

  it('should evaluate the then branch if the condition is false', () => {
    initInterpret(`(print (if false 1 2))`, {
      if: ifFn,
      print: (output: any) => expect(output).toBe(2),
    })
  })

  it('should has arity 3', () => {
    expect(ifFn.arity).toBe(3)
  })

  it('should has native toString', () => {
    expect(ifFn.toString()).toBe('<if function>')
    expect(ifFn.toJS()).toBe('<if function>')
    expect(ifFn.debugTypeOf()).toBe('Function')
  })
})
