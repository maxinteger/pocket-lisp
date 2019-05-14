import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { nativeFn } from 'stdlib/utils'
import { vector } from 'stdlib/data/Vector'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/Vector', () => {
  it('should create empty Vector', () => {
    const print = nativeFn(output => expect(output).deep.equals([]))

    initInterpret(`(print [])`, { vector, print })
    initInterpret(`(print (vector))`, { vector, print })
  })

  it('should create not empty vector', () => {
    const print = nativeFn(output => expect(output).deep.equals([1, 2, 3]))

    initInterpret(`(print [1 2 3])`, { vector, print })
    initInterpret(`(print (vector 1 2 3))`, { vector, print })
  })

  it('should has arity -1', () => {
    expect(vector.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(vector.toString()).equals(NATIVE_FN_NAME)
  })
})
