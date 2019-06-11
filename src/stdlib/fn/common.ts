import * as op from 'stdlib/types'

export const unboxing = (x: op.SerializeToJS<unknown>): unknown => x[op.toJS]()
