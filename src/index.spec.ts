import { PocketLisp } from '.'
import { SnippetPosition } from './dataTypes/SnippetPosition'

const add = (a: number, b: number): number => a + b

describe('Pocket Lisp', () => {
  it('should init a new interpreter without error', () => {
    expect(() => new PocketLisp()).not.toThrow()
  })

  describe('execute method', () => {
    it('should catch syntax errors', async () => {
      const source = '(print (+ 1 2)'
      try {
        await new PocketLisp().execute(source)
      } catch (e) {
        expect(e).toEqual({
          type: 'Parser',
          errors: [{ message: "Expected ')'.", position: new SnippetPosition(source, 14, 14, 1) }],
        })
      }
    })

    it('should catch runtime errors', async () => {
      const source = '(print (+ 1 2))'
      try {
        await new PocketLisp().execute(source)
      } catch (e) {
        expect(e).toEqual({
          type: 'Runtime',
          errors: [
            {
              message: `Undefined identifier: '+'.`,
              position: new SnippetPosition(source, 8, 9, 1),
            },
          ],
        })
      }
    })

    it('should catch runtime errors', async () => {
      await new PocketLisp({
        globals: { '+': add, print: (val: any) => expect(val).toBe(3) },
      }).execute('(print (+ 1 2))')
    })
  })

  describe('evalFn', () => {
    it('should evaluate a PL callable', async () => {
      const pl = new PocketLisp({
        globals: {
          '+': add,
          op: (fn: any, a: any, b: any) => pl.evalFn(fn, [a, b]),
          print: (val: any) => expect(val).toBe(3),
        },
      })
      await pl.execute('(print (op + 1 2))')
    })
  })
})
