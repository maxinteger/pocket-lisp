import { initInterpret } from '../../test/testUtils'
import { effFn } from './eff'
import { PLFunction } from '../dataTypes/PLFunction'
import { def } from './def'

describe('stdlib/core/eff', () => {
  it('should fails when got less then 1 parameter', () => {
    expect(() => initInterpret('(eff)', { eff: effFn })).toThrow('Eff expected at least 1 argument, but got 0.')
  })

  it('should fails when got non-function first parameter', () => {
    expect(() => initInterpret('(eff "hello")', { eff: effFn })).toThrow('Eff first parameter must be a function.')
  })

  it('should return with an infinite args function', () => {
    expect(
      initInterpret('(print (eff fn))', {
        eff: effFn,
        fn: () => 0,
        print: (fn: any) => {
          expect(fn instanceof PLFunction).toBe(true)
          expect(fn._arity).toBe(-1)
        },
      }),
    )
  })
  it('should call the passed fn', () => {
    expect(
      initInterpret('(print ((eff fn)))', {
        eff: effFn,
        fn: () => 42,
        print: (output: unknown) => expect(output).toBe(42),
      }),
    )
  })

  it('should accept arguments and pass them to the function', () => {
    expect(
      initInterpret('(print ((eff fn "hello")))', {
        eff: effFn,
        fn: (x: unknown) => x,
        print: (output: unknown) => expect(output).toBe('hello'),
      }),
    )
  })

  it('should with function which are not pure', () => {
    let i = 0
    expect(
      initInterpret(
        `
      (def side-effect-fn (eff fn 5))
      (print1 (side-effect-fn))
      (print2 (side-effect-fn))
      `,
        {
          eff: effFn,
          def: def,
          fn: (inc: number) => (i += inc),
          print1: (output: unknown) => expect(output).toBe(5),
          print2: (output: unknown) => expect(output).toBe(10),
        },
      ),
    )
  })

  it('should has arity infinite', () => {
    expect(effFn.arity).toBe(-1)
  })

  it('should has native toString', () => {
    expect(effFn.toString()).toBe('<<eff function>>')
    expect(effFn.toJS()).toBe('<<eff function>>')
    expect(effFn.debugTypeOf()).toBe('Function')
  })
})
