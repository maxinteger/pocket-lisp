import { initInterpret } from '../../test/testUtils'
import { sideEffectFn } from './side-effect'
import { PLFunction } from '../dataTypes/PLFunction'
import { def } from './def'

describe('stdlib/core/eff', () => {
  it('should fails when got less then 1 parameter', () => {
    expect(() => initInterpret('(side-effect)', { ['side-effect']: sideEffectFn })).toThrow(
      'Eff expected at least 1 argument, but got 0.',
    )
  })

  it('should fails when got non-function first parameter', () => {
    expect(() => initInterpret('(side-effect "hello")', { ['side-effect']: sideEffectFn })).toThrow(
      'Eff first parameter must be a function.',
    )
  })

  it('should return with an infinite args function', () => {
    expect(
      initInterpret('(print (side-effect fn))', {
        ['side-effect']: sideEffectFn,
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
      initInterpret('(print ((side-effect fn)))', {
        ['side-effect']: sideEffectFn,
        fn: () => 42,
        print: (output: unknown) => expect(output).toBe(42),
      }),
    )
  })

  it('should accept arguments and pass them to the function', () => {
    expect(
      initInterpret('(print ((side-effect fn "hello")))', {
        ['side-effect']: sideEffectFn,
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
      (def side-effect-fn (side-effect fn 5))
      (print1 (side-effect-fn))
      (print2 (side-effect-fn))
      `,
        {
          ['side-effect']: sideEffectFn,
          def: def,
          fn: (inc: number) => (i += inc),
          print1: (output: unknown) => expect(output).toBe(5),
          print2: (output: unknown) => expect(output).toBe(10),
        },
      ),
    )
  })

  it('should has arity infinite', () => {
    expect(sideEffectFn.arity).toBe(-1)
  })

  it('should has native toString', () => {
    expect(sideEffectFn.toString()).toBe('<side-effect function>')
    expect(sideEffectFn.toJS()).toBe('<side-effect function>')
    expect(sideEffectFn.debugTypeOf()).toBe('Function')
  })
})
