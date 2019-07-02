import { BaseNumberOp, Functor, Semigroup } from 'stdlib/types'
import { assertType } from 'stdlib/utils'
import * as op from 'stdlib/types'
import { PLCallable } from 'lang/types'
import { Interpreter } from 'lang'

type BinaryBaseNumberOp = <a extends BaseNumberOp<any>>(
  a: BaseNumberOp<a>,
  b: BaseNumberOp<a>
) => ThisType<a>

export const negate: <a extends BaseNumberOp<any>>(a: BaseNumberOp<a>) => ThisType<a> = a => {
  return a[op.negate]()
}

export const add: BinaryBaseNumberOp = (a, b) => {
  assertType(a, b)
  return a[op.add](b)
}

export const subtract: BinaryBaseNumberOp = (a, b) => {
  assertType(a, b)
  return a[op.subtract](b)
}

export const multiple: BinaryBaseNumberOp = (a, b) => {
  assertType(a, b)
  return a[op.multiple](b)
}

export const divide: BinaryBaseNumberOp = (a, b) => {
  assertType(a, b)
  return a[op.divide](b)
}

export function map<a, b>(this: Interpreter, fn: PLCallable, f: Functor<a>): Functor<b> {
  return f[op.map](x => this.evalFn(fn, [x]) as b)
}

///

export const concat: <a extends Semigroup<any>>(a: a, b: a) => a = (a, b) => {
  assertType(a, b)
  return a[op.concat](b)
}

export default {
  negate,
  '+': add,
  '-': subtract,
  '*': multiple,
  '/': divide,
  ':': concat,
  map
}
