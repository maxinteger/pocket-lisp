import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { nativeFn } from 'stdlib/utils'
import { HashMap } from 'stdlib/data/HashMap'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/HashMap', () => {
  it('should create empty hashMap', () => {
    const print = nativeFn(output =>
      expect(Array.from((output as Map<any, any>).keys())).deep.equals([])
    )

    initInterpret(`(print {})`, { HashMap, print })
    initInterpret(`(print (HashMap))`, { HashMap, print })
  })

  it('should throw error if it get not even number of parameters', () => {
    expect(() => initInterpret(`(print {"x" 1 "y"})`, { HashMap })).throw(
      'Expected even number of arguments (key, value pairs), but got 3'
    )
  })

  it('should create not empty hashMap', () => {
    const print = nativeFn(output =>
      expect(Array.from((output as Map<any, any>).entries())).deep.equals([['x', 1]])
    )
    initInterpret(`(print {"x" 1})`, { HashMap, print })
    initInterpret(`(print (HashMap "x" 1))`, { HashMap, print })
  })

  it('should has arity -1', () => {
    expect(HashMap.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(HashMap.toString()).equals(NATIVE_FN_NAME)
  })
})
