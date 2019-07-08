import { plNumber, PLNumber } from 'stdlib/data/PLNumber'
import { toInt } from 'stdlib/utils'
import { PLVector, plVector } from 'stdlib/data/PLVector'

export const range = (start: PLNumber, len: PLNumber, step: PLNumber): PLVector<PLNumber> => {
  const from = start.value
  const d = step.value

  const length = toInt(len.value)
  let x = from
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(plNumber(x))
    x += d
  }
  return plVector(...arr)
}

export const range0 = (len: PLNumber): PLVector<PLNumber> => {
  const length = toInt(len.value)
  return plVector(...Array.from({ length }, (_v, idx) => plNumber(idx)))
}
