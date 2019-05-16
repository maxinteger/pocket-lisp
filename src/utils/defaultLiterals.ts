import { RuntimeError } from 'dataTypes/RuntimeError'
import { nativeFn } from 'stdlib/utils'
import { PLLiteral, PLLiterals } from 'types'

const notImplementedLiteral = (name: string): PLLiteral => ({
  parser: () => {
    throw new RuntimeError(`${name} is not implemented`)
  },
  factory: nativeFn(() => {
    throw new RuntimeError(`${name} is not implemented`)
  })
})

export const defaultLiterals: PLLiterals = {
  bool: {
    parser: (x: string) => x === 'true',
    factory: nativeFn(Boolean)
  },
  int: {
    parser: (x: string) => parseInt(x, 10),
    factory: nativeFn(Number)
  },
  float: {
    parser: parseFloat,
    factory: nativeFn(Number)
  },
  fractionNumber: notImplementedLiteral('FractionNumber'),
  vector: notImplementedLiteral('Vector'),
  hashMap: notImplementedLiteral('HashMap')
}
