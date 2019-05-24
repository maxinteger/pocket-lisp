import ops from 'stdlib/fn/typeClass'
import { plVector } from 'stdlib/data/PLVector'
import { plHashMap } from 'stdlib/data/PLHashMap'
import { and, not, or, plBool, str2plBool } from 'stdlib/data/PLBool'
import * as math from 'stdlib/fn/math'
import { plNumber, str2PLNumber } from 'stdlib/data/PLNumber'
import { plFractionNumber, reciprocal, str2plFractionNumber } from 'stdlib/data/PLFractionNumber'
import { plString } from 'stdlib/data/PLString'
import { PLLiterals } from 'lang/types'

export const literals: PLLiterals = {
  bool: {
    parser: str2plBool,
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
    parser: str2plFractionNumber,
    factory: plFractionNumber
  },
  string: {
    parser: plString,
    factory: plString
  },
  vector: {
    factory: plVector
  },
  hashMap: {
    factory: plHashMap
  }
}

export const runtime = {
  ...ops,
  ...math,
  not,
  and,
  or,
  reciprocal
}
