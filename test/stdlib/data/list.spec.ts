import { expect } from 'chai'
import { initInterpret } from '../utils'
import { nativeFn } from 'stdlib/utils'
import { List } from 'stdlib/data/list'
import { NATIVE_FN_NAME } from 'stdlib/constants'


describe('stdlib/core/list', () => {
  it('should create empty list', () => {
    initInterpret(
      `(print [])`,
      { List, print: nativeFn(output => expect(output).deep.equals([])) }
    )
    initInterpret(
      `(print (List))`,
      { List, print: nativeFn(output => expect(output).deep.equals([])) }
    )
  })
  it('should create not empty list', () => {
    initInterpret(
      `(print [1 2 3])`,
      { List, print: nativeFn(output => expect(output).deep.equals([1,2,3])) }
    )
    initInterpret(
      `(print (List 1 2 3))`,
      { List, print: nativeFn(output => expect(output).deep.equals([1,2,3])) }
    )
  })

  it('should has arity -1', () => {
    expect(List.arity()).equals(-1)
  })

  it('should has native toString', () => {
    expect(List.toString()).equals(NATIVE_FN_NAME)
  })
})
