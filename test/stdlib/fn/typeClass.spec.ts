import { expect } from 'chai'
import { add, concat, divide, multiple, negate, subtract } from 'stdlib/fn/typeClass'
import { PLNumber, plNumber } from 'stdlib/data/PLNumber'
import { plString } from 'stdlib/data/PLString'
import { PocketLisp } from 'lang'
import { literals, runtime, utils } from 'stdlib/index'
import { plVector } from 'stdlib/data/PLVector'

describe('stdlib/fn/typeClass', () => {
  describe('basic math functions', () => {
    it('should work with identical type ', () => {
      const tests = [
        { fn: () => negate(plNumber(1)), res: plNumber(-1) },
        { fn: () => add(plNumber(1), plNumber(2)), res: plNumber(3) },
        { fn: () => subtract(plNumber(1), plNumber(2)), res: plNumber(-1) },
        { fn: () => multiple(plNumber(5), plNumber(2)), res: plNumber(10) },
        { fn: () => divide(plNumber(1), plNumber(2)), res: plNumber(0.5) },
        { fn: () => concat(plString('hello'), plString('world')), res: plString('helloworld') }
      ]

      tests.map(({ fn, res }) => {
        expect(fn()).deep.equals(res)
      })
    })

    it('should fail if the first parameter does not support the operation', () => {
      const tests = [
        { fn: () => negate(plString('ok') as any), res: 'a[op.negate] is not a function' },
        {
          fn: () => add(plString('ok') as any, plString('_') as any),
          res: 'a[op.add] is not a function'
        },
        {
          fn: () => subtract(plString('ok') as any, plString('_') as any),
          res: 'a[op.subtract] is not a function'
        },
        {
          fn: () => multiple(plString('ok') as any, plString('_') as any),
          res: 'a[op.multiple] is not a function'
        },
        {
          fn: () => divide(plString('ok') as any, plString('_') as any),
          res: 'a[op.divide] is not a function'
        },
        {
          fn: () => concat(plNumber(1) as any, plNumber(2) as any),
          res: 'a[op.concat] is not a function'
        }
      ]
      tests.map(({ fn, res }) => {
        expect(() => fn()).throw(res)
      })
    })
  })

  describe('map', () => {
    it('should work any Functor type', async () => {
      const code = `(print (map #(* %1 10) [1 2 3]))`
      const expected = plVector(plNumber(10), plNumber(20), plNumber(30))

      const print = (out: any) => expect(out).deep.equals(expected)
      const multiple = (a: PLNumber, b: PLNumber) => a.value * b.value
      const pl = new PocketLisp({ globals: { ...runtime, print, multiple }, utils }, literals)
      await pl.execute(code)
    })
  })
})
