import { expect } from 'chai'
import { initInterpret } from '../testUtils'
import { nativeFn } from 'stdlib/utils'
import { List } from 'stdlib/data/List'
import { NATIVE_FN_NAME } from 'stdlib/constants'

describe('stdlib/core/list', () => {
  it('should create empty list', () => {
    const print = nativeFn(output => expect(output).deep.equals([]))

    initInterpret(`(print [])`, { List, print })
    initInterpret(`(print (List))`, { List, print })
  })

  it('should create not empty list', () => {
    const print = nativeFn(output => expect(output).deep.equals([1, 2, 3]))

    initInterpret(`(print [1 2 3])`, { List, print })
    initInterpret(`(print (List 1 2 3))`, { List, print })
  })

  it('should has arity -1', () => {
    expect(List.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(List.toString()).equals(NATIVE_FN_NAME)
  })
})
