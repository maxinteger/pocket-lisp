import { expect } from 'chai'
import { initInterpret } from '../../testUtils'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { def, fn } from 'lang/core'

describe('stdlib/core/fn', () => {
  it('should fail it parameter number is less or more then 2', () => {
    expect(() => initInterpret('(fn x)', { fn })).throw('Expected 2 argument(s), but got 1')
    expect(() => initInterpret('(fn x 1 2)', { fn })).throw('Expected 2 argument(s), but got 3')
  })

  it('should throw error if the first parameter is not list of identifier', () => {
    expect(() => initInterpret('(fn 1 ())', { fn })).throw(
      "Invalid function parameter, actual: 'int', expected: 'list'"
    )
    expect(() => initInterpret('(fn [1] 42)', { fn })).throw(
      "Invalid function parameter, actual: 'int', expected: 'identifier'"
    )
  })

  it('function definition can be evaluated inline', () => {
    initInterpret(`(print ((fn [] (+ 1 2)))))`, {
      fn,
      '+': (a: number, b: number) => a + b,
      print: (output: any) => expect(output).equals(3)
    })
  })

  describe('function arguments', () => {
    it('should be available as local variables', () => {
      initInterpret(`(print ((fn [a b] (+ a b)) 1 2))`, {
        fn,
        '+': (a: number, b: number) => a + b,
        print: (output: any) => expect(output).equals(3)
      })
    })
  })

  describe('closure', () => {
    it('should work', () => {
      initInterpret(`
      (def add (fn [a] ( fn [b] (+ a b) )))
      (def addTo10 (add 10))
      (print (addTo10 1))
      `, {
        fn,
        def,
        '+': (a: number, b: number) => a + b,
        print: (output: any) => expect(output).equals(11)
      })
    })
  })

  it('should has arity 2', () => {
    expect(fn.arity).equals(2)
  })

  it('should has native toString', () => {
    expect(fn.toString()).equals(NATIVE_FN_NAME)
  })
})