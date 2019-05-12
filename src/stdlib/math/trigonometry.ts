import { nativeFn } from 'stdlib/utils'

const DEG_TO_RAD = Math.PI / 180

export const deg2rad = nativeFn((x: number) => x * DEG_TO_RAD)
export const rad2deg = nativeFn((x: number) => x / DEG_TO_RAD)

export const sin = nativeFn(Math.sin)
export const asin = nativeFn(Math.asin)
export const asinh = nativeFn(Math.asinh)

export const cos = nativeFn(Math.cos)
export const acos = nativeFn(Math.acos)
export const acosh = nativeFn(Math.acosh)

export const tan = nativeFn(Math.tan)
export const atan = nativeFn(Math.atan)
export const atan2 = nativeFn(Math.atan2)
export const atanh = nativeFn(Math.atanh)
