import { constFn } from './const'
import { initInterpret } from '../../test/testUtils'
import { PLFunction } from '../dataTypes/PLFunction'

describe('stdlib/core/const', () => {
  it('should return with a 0 args function', () => {
    expect(
      initInterpret('(print (const "hello"))', {
        const: constFn,
        fn: () => 0,
        print: (fn: any) => {
          expect(fn instanceof PLFunction).toBe(true)
          expect(fn._arity).toBe(-1)
        },
      }),
    )
  })

  it('should return with the passed value after call the returned function', () => {
    expect(
      initInterpret('(print ((const "hello")))', {
        const: constFn,
        print: (output: unknown) => expect(output).toBe('hello'),
      }),
    )
    expect(
      initInterpret('(print (((const fn))))', {
        const: constFn,
        fn: () => 42,
        print: (output: unknown) => expect(output).toBe(42),
      }),
    )
  })

  it('should ignore args from when the return function called', () => {
    expect(
      initInterpret('(print ((const "hello") 42 ))', {
        const: constFn,
        print: (output: unknown) => expect(output).toBe('hello'),
      }),
    )
    expect(
      initInterpret('(print (((const fn) "xyz")))', {
        const: constFn,
        fn: () => 42,
        print: (output: unknown) => expect(output).toBe(42),
      }),
    )
  })

  it('should has arity infinite', () => {
    expect(constFn.arity).toBe(1)
  })

  it('should has native toString', () => {
    expect(constFn.toString()).toBe('<const function>')
    expect(constFn.toJS()).toBe('<const function>')
    expect(constFn.debugTypeOf()).toBe('Function')
  })
})
