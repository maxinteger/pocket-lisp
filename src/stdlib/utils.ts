import { RuntimeError } from 'lang/dataTypes/RuntimeError'

///

export const assert = (val: boolean, msg: string): boolean => {
  // TODO remove lang dependency
  if (val) throw new RuntimeError(msg)
  return true
}

export const assertType = (a: any, b: any): boolean =>
  assert(
    a.constructor !== b.constructor,
    `Type mismatch between: '${a.constructor && a.constructor.name}' and '${b.constructor &&
      b.constructor.name}'`
  )

export const typeCheck = (type: any, value: any): boolean =>
  assert(
    type !== value.constructor,
    `Expected '${type.name}', but got '${value.constructor.name}'.`
  )

export const chunk = (ary: any[], chunkSize = 2): any[] => {
  const newAry = []
  const end = ary.length
  for (let i = 0; i < end; i += chunkSize) {
    newAry.push(ary.slice(i, i + chunkSize))
  }
  return newAry
}
