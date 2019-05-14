import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { nativeFn } from 'stdlib/utils'
import { hashMap } from 'stdlib/data/HashMap'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/HashMap', () => {
  it('should create empty hashMap', () => {
    const print = nativeFn(output =>
      expect(Array.from((output as Map<any, any>).keys())).deep.equals([])
    )

    initInterpret(`(print {})`, { hashMap, print })
    initInterpret(`(print (hashMap))`, { hashMap, print })
  })

  it('should throw error if it get not even number of parameters', () => {
    expect(() => initInterpret(`(print {"x" 1 "y"})`, { hashMap })).throw(
      'Expected even number of arguments (key, value pairs), but got 3'
    )
  })

  it('should create not empty hashMap', () => {
    const print = nativeFn(output =>
      expect(Array.from((output as Map<any, any>).entries())).deep.equals([['x', 1]])
    )
    initInterpret(`(print {"x" 1})`, { hashMap, print })
    initInterpret(`(print (hashMap "x" 1))`, { hashMap, print })
  })

  it('should has arity -1', () => {
    expect(hashMap.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(hashMap.toString()).equals(NATIVE_FN_NAME)
  })
})
