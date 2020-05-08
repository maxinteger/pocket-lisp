import { expect } from 'chai'
import { PocketLisp } from '.'

const add = (a: number, b: number): number => a + b

describe('Pocket Lisp', () => {
  it('should init a new interpreter without error', () => {
    expect(() => new PocketLisp()).not.throw()
  })

  describe('execute method', () => {
    it('should catch syntax errors', async () => {
      try {
        await new PocketLisp().execute('(print (+ 1 2)')
      } catch (e) {
        expect(e).deep.equals({
          type: 'Parser',
          errors: [{ line: 1, message: "Expected ')'." }]
        })
      }
    })

    it('should catch runtime errors', async () => {
      try {
        await new PocketLisp().execute('(print (+ 1 2))')
      } catch (e) {
        expect(e).deep.equals({
          type: 'Runtime',
          errors: [{ message: `Undefined identifier: '+'.` }]
        })
      }
    })

    it('should catch runtime errors', async () => {
      await new PocketLisp({
        globals: { '+': add, print: (val: any) => expect(val).equals(3) }
      }).execute('(print (+ 1 2))')
    })
  })

  describe('evalFn', () => {
    it('should evaluate a PL callable', async () => {
      const pl = new PocketLisp({
        globals: {
          '+': add,
          op: (fn: any, a: any, b: any) => pl.evalFn(fn, [a, b]),
          print: (val: any) => expect(val).equals(3)
        }
      })
      await pl.execute('(print (op + 1 2))')
    })
  })
})
