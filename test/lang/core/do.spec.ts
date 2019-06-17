import { expect } from 'chai'
import { initInterpret } from '../../testUtils'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { doFn } from 'lang/core/do'

describe('stdlib/core/do', () => {
  it('should throw error with 0 parameters', () => {
    expect(() => initInterpret(`(print (do))`, { do: doFn })).throw(
      'Expected at least 1 argument, but got 0.'
    )
  })

  it('should with 1 parameter', () => {
    initInterpret(`(print (do 42))`, {
      do: doFn,
      print: (output: any) => expect(output).equals(42)
    })
	})

  it('should return with the last expression value', () => {
    initInterpret(`(print (do 1 2 42))`, {
      do: doFn,
      print: (output: any) => expect(output).equals(42)
    })
  })

  it('should has arity 0', () => {
    expect(doFn.arity).equals(0)
  })

  it('should has native toString', () => {
    expect(doFn.toString()).equals(NATIVE_FN_NAME)
  })
})
