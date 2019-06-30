import { expect } from 'chai'
import { initInterpret } from '../../testUtils'
import { def } from 'lang/core/def'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { fn } from 'lang/core'
import { defn } from 'lang/core/defn'

const add = (a: number, b: number) => a + b

describe('stdlib/core/defn', () => {
  it('should fail it parameter number is more then 3', () => {
    expect(
      () =>
      initInterpret('(defn x [a] (+ a 10) 42)', {
        fn,
        def,
        defn,
        '+': add
      })
    ).throw('Expected 3 argument(s), but got 4')
  })

  it('should throw error if the first parameter is not identifier', () => {
    expect(() => initInterpret('(defn 1 [a] (+ a 41))', { def, defn, fn })).throw(
      "Invalid function parameter, actual: 'int', expected: 'identifier'"
    )
    expect(() => initInterpret('(defn "x" [a] (+ a 41))', { def, defn, fn })).throw(
      "Invalid function parameter, actual: 'string', expected: 'identifier'"
    )
  })

  it('should define new variable', () => {
    initInterpret(
      `
		(defn x [a] (+ a 41))
		(print (x 1))
		`,
      { def, defn, fn, '+': add, print: (output: any) => expect(output).equals(42) }
    )
  })

  it('should has arity 0', () => {
    expect(defn.arity).equals(-1)
  })

  it('should has native toString', () => {
    expect(defn.toString()).equals(NATIVE_FN_NAME)
  })
})
