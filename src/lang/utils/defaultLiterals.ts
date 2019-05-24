import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { PLLiteral, PLLiterals } from 'lang/types'

const notImplementedFactory = (name: string): any => (_value: any) => () => {
  throw new RuntimeError(`${name} is not implemented`)
}

const notImplementedLiteral = (name: string): PLLiteral => ({
  parser: () => {
    throw new RuntimeError(`${name} is not implemented`)
  },
  factory: notImplementedFactory(name)
})

export const defaultLiterals: PLLiterals = {
  bool: {
    parser: (x: string) => x === 'true',
    factory: Boolean
  },
  int: {
    parser: (x: string) => parseInt(x, 10),
    factory: Number
  },
  float: {
    parser: parseFloat,
    factory: Number
  },
  string: {
    parser: (str: string) => str,
    factory: String
  },
  fractionNumber: {
    parser: (str: string) => str,
    factory: () => undefined
  },
  vector: notImplementedLiteral('Vector'),
  hashMap: notImplementedLiteral('HashMap')
}
