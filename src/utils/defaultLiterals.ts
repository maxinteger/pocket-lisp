import { RuntimeError } from '../dataTypes/RuntimeError'
import { PLLiteral, PLLiterals } from '../types'
import { identity } from './fn'

const notImplementedConstructor = (name: string) => () => {
  throw new RuntimeError(`${name} is not implemented.`)
}

const notImplementedLiteral = (name: string): PLLiteral => ({
  parser: () => {
    throw new RuntimeError(`${name} is not implemented.`)
  },
  nativeConstructor: notImplementedConstructor(name),
  langConstructor: notImplementedConstructor(name),
})

export const defaultLiterals: PLLiterals = {
  Bool: {
    parser: (x: string): boolean => x === 'true',
    nativeConstructor: Boolean,
    langConstructor: identity,
  },
  Int: {
    parser: (x: string): number => parseInt(x, 10),
    nativeConstructor: Number,
    langConstructor: identity,
  },
  Float: {
    parser: parseFloat,
    nativeConstructor: Number,
    langConstructor: identity,
  },
  String: {
    parser: (str: string): string => str,
    nativeConstructor: String,
    langConstructor: identity,
  },
  FractionNumber: {
    parser: (str: string): string => str,
    nativeConstructor: notImplementedConstructor('FractionNumber'),
    langConstructor: notImplementedConstructor('FractionNumber'),
  },
  Vector: notImplementedLiteral('Vector'),
  HashMap: notImplementedLiteral('HashMap'),
}
