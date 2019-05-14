import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { nativeFn } from 'stdlib/utils'
import { Vector } from 'stdlib/data/Vector'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/Vector', () => {
  it('should create empty Vector', () => {
    const print = nativeFn(output => expect(output).deep.equals([]))

    initInterpret(`(print [])`, { Vector, print })
    initInterpret(`(print (Vector))`, { Vector, print })
  })

  it('should create not empty vector', () => {
    const print = nativeFn(output => expect(output).deep.equals([1, 2, 3]))

    initInterpret(`(print [1 2 3])`, { Vector, print })
    initInterpret(`(print (Vector 1 2 3))`, { Vector, print })
  })

  it('should has arity -1', () => {
    expect(Vector.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(Vector.toString()).equals(NATIVE_FN_NAME)
  })
})
