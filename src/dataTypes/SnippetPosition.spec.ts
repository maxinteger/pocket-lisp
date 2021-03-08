import { SnippetPosition } from './SnippetPosition'

describe('SnippetPosition', () => {
  it('should store values correctly', () => {
    const sp = new SnippetPosition('a b c', 2, 3, 1)
    expect(sp.source).toBe('a b c')
    expect(sp.startIndex).toBe(2)
    expect(sp.endIndex).toBe(3)
    expect(sp.line).toBe(1)
    expect(sp.length).toBe(1)
  })

  it('should calculate line start index', () => {
    expect(new SnippetPosition('a b c', 2, 3, 1).start).toBe(2)
    expect(new SnippetPosition('a \nb c', 3, 4, 2).start).toBe(1)
  })

  it('should calculate line end index', () => {
    expect(new SnippetPosition('a b c', 2, 3, 1).end).toBe(3)
    expect(new SnippetPosition('a \nb c', 3, 4, 2).end).toBe(2)
  })
})
