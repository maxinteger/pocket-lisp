import { initInterpret } from '../../test/testUtils'
import { def, fn } from '.'

describe('stdlib/core/fn', () => {
  it('should fail it parameter number is more then 2', () => {
    expect(() => initInterpret('(fn [] 1 2)', { fn })).toThrow('Expected 2 arguments, but got 3.')
  })

  it('should throw error if the first parameter is not list of identifier', () => {
    expect(() => initInterpret('(fn 1 ())', { fn })).toThrow(
      "Invalid function parameter, actual: 'int', expected: 'list'",
    )
    expect(() => initInterpret('(fn [1] 42)', { fn })).toThrow(
      "Invalid function parameter, actual: 'int', expected: 'identifier'",
    )
  })

  it('function definition can be evaluated inline', () => {
    initInterpret(`(print ((fn [] (+ 1 2)))))`, {
      fn,
      '+': (a: number, b: number) => a + b,
      print: (output: any) => expect(output).toBe(3),
    })
  })

  describe('function arguments', () => {
    it('should be available as local variables', () => {
      initInterpret(`(print ((fn [a b] (+ a b)) 1 2))`, {
        fn,
        '+': (a: number, b: number) => a + b,
        print: (output: any) => expect(output).toBe(3),
      })
    })
  })

  describe('chained function call', () => {
    it('should work', () => {
      initInterpret(`(print ((fn [a] (fn [b] (+ a b))) 1 2))`, {
        fn,
        '+': (a: number, b: number) => a + b,
        print: (output: any) => expect(output).toBe(3),
      })
    })
  })

  describe('closure', () => {
    it('should work', () => {
      initInterpret(
        `
      (def add (fn [a] ( fn [b] (+ a b) )))
      (def addTo10 (add 10))
      (print (addTo10 1))
      `,
        {
          fn,
          def,
          '+': (a: number, b: number) => a + b,
          print: (output: any) => expect(output).toBe(11),
        },
      )
    })

    it('should hide internal variables', () => {
      const test = () =>
        initInterpret(
          `
      (def add (fn [a] ( do (def x 10) )))
      (print x)
      `,
          {
            fn,
            def,
            print: (a: any) => a,
          },
        )

      expect(test).toThrow(`Undefined identifier: 'x'.`)
    })

    it('should work with lambda functions', () => {
      initInterpret(
        `
          (def map #(%1 %2))
          (def fn-1 (fn [a b c] (print a b c)))
          (def fn-2 #(map (fn-1 %3 %1) %2))
          (fn-2 "A" "B" "C") 
      `,
        {
          fn,
          def,
          print: (a: unknown, b: unknown, c: unknown) => expect([a, b, c]).toEqual(['C', 'A', 'B']),
        },
      )
    })
  })

  describe('#() dispatch', () => {
    it('should create a working anonymous function', () => {
      initInterpret(`(print (#(+ %1 $2) 1 2)`, {
        fn,
        '+': (a: number, b: number) => a + b,
        print: (output: any) => expect(output).toBe(3),
      })
    })
  })

  it('should has arity -1', () => {
    expect(fn.arity).toBe(-1)
  })

  it('should has native toString', () => {
    expect(fn.toString()).toBe('<fn function>')
    expect(fn.toJS()).toBe('<fn function>')
    expect(fn.debugTypeOf()).toBe('Function')
  })
})
