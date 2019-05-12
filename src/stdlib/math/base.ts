import { nativeFn } from 'stdlib/utils'

export const abs = nativeFn(Math.abs)
export const sign = nativeFn(Math.sign)

export const min = nativeFn((a: number, b: number) => Math.min(a, b))
export const max = nativeFn((a: number, b: number) => Math.max(a, b))

export const floor = nativeFn(Math.floor)
export const round = nativeFn(Math.round)
export const ceil = nativeFn(Math.ceil)
export const trunc = nativeFn(Math.trunc)
