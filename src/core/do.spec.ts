import { initInterpret } from '../../test/testUtils'
import { def, doFn } from '.'

describe('stdlib/core/do', () => {
  it('should throw error with 0 parameters', () => {
    expect(() => initInterpret(`(do)`, { do: doFn })).toThrow('Expected at least 1 argument, but got 0.')
  })

  it('should with 1 parameter', () => {
    initInterpret(`(print (do 42))`, {
      do: doFn,
      print: (output: any) => expect(output).toBe(42),
    })
  })

  it('should return with the last expression value', () => {
    initInterpret(`(print (do 1 2 42))`, {
      do: doFn,
      print: (output: any) => expect(output).toBe(42),
    })
  })

  it('should share env between actions', () => {
    initInterpret(
      `
      (do (def x 42) (print x))
    `,
      {
        do: doFn,
        def,
        print: (output: any) => expect(output).toBe(42),
      },
    )
  })

  it('should has arity 0', () => {
    expect(doFn.arity).toBe(-1)
  })

  it('should has native toString', () => {
    expect(doFn.toString()).toBe('<do function>')
    expect(doFn.toJS()).toBe('<do function>')
    expect(doFn.debugTypeOf()).toBe('Function')
  })
})
