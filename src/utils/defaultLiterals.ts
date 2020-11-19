import { RuntimeError } from '../dataTypes/RuntimeError'
import { PLLiteral, PLLiterals } from '../types'

const notImplementedFactory = (name: string) => () => {
  throw new RuntimeError(`${name} is not implemented.`)
}

const notImplementedLiteral = (name: string): PLLiteral => ({
  parser: () => {
    throw new RuntimeError(`${name} is not implemented.`)
  },
  factory: notImplementedFactory(name),
})

export const defaultLiterals: PLLiterals = {
  Bool: {
    parser: (x: string): boolean => x === 'true',
    factory: Boolean,
  },
  Int: {
    parser: (x: string): number => parseInt(x, 10),
    factory: Number,
  },
  Float: {
    parser: parseFloat,
    factory: Number,
  },
  String: {
    parser: (str: string): string => str,
    factory: String,
  },
  FractionNumber: {
    parser: (str: string): string => str,
    factory: (): void => undefined,
  },
  Vector: notImplementedLiteral('Vector'),
  HashMap: notImplementedLiteral('HashMap'),
}
