import ops from './basicFunctions'
import { vector } from 'stdlib/data/Vector'
import { hashMap } from 'stdlib/data/HashMap'
import { plBool, str2bool } from 'stdlib/data/Bool'
import * as math from './math'
import { plNumber, str2PLNumber } from 'stdlib/data/Number'
import { fractionNumber, str2fractionNumber } from 'stdlib/data/FractionNumber'
import { PLLiterals } from 'types'
import { plString } from 'stdlib/data/PLString'

export const literals: PLLiterals = {
  bool: {
    parser: str2bool,
    factory: plBool
  },
  int: {
    parser: str2PLNumber,
    factory: plNumber
  },
  float: {
    parser: str2PLNumber,
    factory: plNumber
  },
  fractionNumber: {
    parser: str2fractionNumber,
    factory: fractionNumber
  },
  string: {
    parser: plString,
    factory: plString
  },
  vector: {
    factory: vector
  },
  hashMap: {
    factory: hashMap
  }
}

export const runtime = {
  ...ops,
  ...math
}
