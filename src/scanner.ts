import { isAlpha, isDigit, isSymbol } from './utils/string'
import { Token, TokenType } from './dataTypes/Token'
import { SnippetPosition } from './dataTypes/SnippetPosition'

export class Scanner {
  private start = 0
  private current = 0
  private line = 1

  public constructor(private source: string) {}

  private isEnd(): boolean {
    return this.source.length === this.current
  }

  private advance(): string {
    this.current += 1
    return this.source[this.current - 1]
  }

  private peek(): string {
    return this.source[this.current]
  }

  private peekNext(): string {
    return this.source[this.current + 1]
  }

  private makeToken(type: TokenType): Token {
    const { start, line, current, source } = this
    const isKeyword = type === TokenType.Keyword
    const value = source.substring(isKeyword ? start + 1 : start, current)
    return new Token(type, value, new SnippetPosition(source, start, current, line))
  }
  private makeStringToken(): Token {
    const { start, line, current, source } = this
    const str = source
      .substring(start + 1, current - 1)
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\')
      .replace(/\\"/g, '"')

    return new Token(TokenType.String, str, new SnippetPosition(source, start, current, line))
  }

  private errorToken(message: string): Token {
    const { start, line, current, source } = this
    return new Token(TokenType.Error, message, new SnippetPosition(source, start, current, line))
  }

  private identifier(): Token {
    for (;;) {
      const peek = this.peek()
      if (!(peek && (isAlpha(peek) || isDigit(peek) || isSymbol(peek)))) {
        break
      }
      this.advance()
    }
    return this.makeIdentifierToken()
  }

  private makeIdentifierToken(): Token {
    const { start, current, source } = this
    const id = source.substring(start, current)

    switch (id) {
      case 'true':
        return this.makeToken(TokenType.True)
      case 'false':
        return this.makeToken(TokenType.False)
      default:
        return this.makeToken(TokenType.Identifier)
    }
  }

  private keyword(): Token {
    if (!isAlpha(this.peek()) && !isDigit(this.peek())) {
      return this.makeToken(TokenType.Identifier)
    }
    while (isAlpha(this.peek()) || isDigit(this.peek())) {
      this.advance()
    }
    return this.makeToken(TokenType.Keyword)
  }

  private number(): Token {
    while (isDigit(this.peek())) this.advance()

    if (this.peek() === '.' && isDigit(this.peekNext())) {
      this.advance()
      while (isDigit(this.peek())) this.advance()
      return this.makeToken(TokenType.Float)
    } else if (this.peek() === '/') {
      if (!isDigit(this.peekNext())) {
        return this.errorToken('Unterminated fraction number')
      }
      this.advance()
      while (isDigit(this.peek())) this.advance()
      return this.makeToken(TokenType.FractionNumber)
    }

    return this.makeToken(TokenType.Integer)
  }

  private string(): Token {
    while (this.peek() !== '"' && !this.isEnd()) {
      if (this.peek() === '\n') this.line += 1
      if (this.peek() === '\\') this.advance()
      this.advance()
    }
    if (this.isEnd()) return this.errorToken('Unterminated string')
    this.advance()
    return this.makeStringToken()
  }

  private skipWhitespace(): void {
    while (true) {
      const c = this.peek()
      switch (c) {
        case ' ':
        case '\r':
        case '\t':
        case ',':
          this.advance()
          break
        case '\n':
          this.line += 1
          this.advance()
          break
        case ';':
          if (this.peekNext() === '#') {
            this.advance()
            this.advance()
            while (this.peek() !== '#' && this.peekNext() !== ';' && !this.isEnd()) {
              if (this.peek() === '\n') this.line += 1
              this.advance()
            }
            this.advance()
            this.advance()
          } else {
            while (this.peek() !== '\n' && !this.isEnd()) this.advance()
          }
          break
        default:
          return
      }
    }
  }

  public scanToken(): Token {
    this.skipWhitespace()
    this.start = this.current

    if (this.isEnd()) {
      return this.makeToken(TokenType.EOF)
    }

    const char = this.advance()

    if (isDigit(char) || (char === '-' && isDigit(this.peek()))) {
      return this.number()
    }

    if ((isAlpha(char) || isSymbol(char)) && !isDigit(char)) {
      return this.identifier()
    }

    switch (char) {
      case '(':
        return this.makeToken(TokenType.LeftParen)
      case ')':
        return this.makeToken(TokenType.RightParen)
      case '{':
        return this.makeToken(TokenType.LeftBrace)
      case '}':
        return this.makeToken(TokenType.RightBrace)
      case '[':
        return this.makeToken(TokenType.LeftSquare)
      case ']':
        return this.makeToken(TokenType.RightSquare)
      case '#':
        return this.makeToken(TokenType.Dispatch)
      case ':':
        return this.keyword()
      case '"':
        return this.string()
    }

    return this.errorToken(`Unexpected character '${char}'.`)
  }

  public scanAllToken(): Token[] {
    const tokens = []
    while (!this.isEnd()) {
      tokens.push(this.scanToken())
    }
    return tokens
  }
}
