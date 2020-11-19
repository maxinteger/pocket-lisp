import { reduceLiterals } from './fn'
import { Literal, LiteralType } from '../dataTypes/Literal'
import { SnippetPosition } from '../dataTypes/SnippetPosition'

describe('lang utils', () => {
  describe('reduceLiterals', () => {
    it('should walk through the literals recursively', () => {
      const literals = new Literal<LiteralType.List>(
        LiteralType.List,
        [
          new Literal(LiteralType.Boolean, true, SnippetPosition.unknown),
          new Literal(LiteralType.Integer, 42, SnippetPosition.unknown),
          new Literal(LiteralType.Float, 42.5, SnippetPosition.unknown),
          new Literal(LiteralType.FractionNumber, '1/2', SnippetPosition.unknown),
          new Literal(LiteralType.String, 'hello world', SnippetPosition.unknown),
          new Literal(LiteralType.Keyword, ':keyword', SnippetPosition.unknown),
          new Literal(LiteralType.Identifier, 'variable', SnippetPosition.unknown),
        ],
        SnippetPosition.unknown,
      )

      const result = reduceLiterals(literals, (acc, l) => {
        if (l.kind === LiteralType.List) {
          acc.push('LIST')
        } else {
          acc.push(l.value)
        }
        return acc
      })

      expect(result).toEqual([true, 42, 42.5, '1/2', 'hello world', ':keyword', 'variable', 'LIST'])
    })
  })
})
