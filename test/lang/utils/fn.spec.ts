import { expect } from 'chai'

import { reduceLiterals } from 'lang/utils/fn'
import { Literal, LiteralType } from 'lang/dataTypes/Literal'

describe('lang utils', () => {
  describe('reduceLiterals', () => {
    it('should walk through the literals recursively', () => {
      const literals = new Literal<LiteralType.List>(LiteralType.List, [
        new Literal(LiteralType.Boolean, true),
        new Literal(LiteralType.Integer, 42),
        new Literal(LiteralType.Float, 42.5),
        new Literal(LiteralType.FractionNumber, '1/2'),
        new Literal(LiteralType.String, 'hello world'),
        new Literal(LiteralType.Keyword, ':keyword'),
        new Literal(LiteralType.Identifier, 'variable')
      ])

      const result = reduceLiterals(literals, (acc, l) => {
        if (l.kind === LiteralType.List) {
          acc.push('LIST')
        } else {
          acc.push(l.value)
        }
        return acc
      })

      expect(result).deep.equals([
        true,
        42,
        42.5,
        '1/2',
        'hello world',
        ':keyword',
        'variable',
        'LIST'
      ])
    })
  })
})
