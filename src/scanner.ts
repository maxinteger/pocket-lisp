const EOF = undefined

export enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_SQUARE,
  RIGHT_SQUARE,
  IDENTIFIER,
  KEYWORD,
  STRING,
  INTEGER_NUMBER,
  FLOAT_NUMBER,
  FRACTION_NUMBER,
  ERROR,
  INIT,
  EOF
}

export class Token {
  constructor(public type: TokenType, public value: string, public line: number) {}

  static INIT = new Token(TokenType.INIT, '', 0)
}

export class Scanner {
  private start = 0
  private current = 0
  private line = 1

  constructor(private source: string) {}

  private isEnd() {
    return this.source.length === this.current
  }

  private advance() {
    this.current += 1
    return this.source[this.current - 1]
  }

  private peek() {
    return this.source[this.current]
  }

  private peekNext() {
    if (this.isEnd()) return EOF
    return this.source[this.current + 1]
  }

  private makeToken(type: TokenType) {
    const { start, line, current, source } = this
    return new Token(type, source.substr(start, current), line)
  }
  private makeStringToken() {
    const { start, line, current, source } = this
    return new Token(TokenType.STRING, source.substr(start + 1, current - 2), line)
  }

  private errorToken(message: string) {
    return new Token(TokenType.ERROR, message, this.line)
  }

  private identifier() {
    while (isAlpha(this.peek()) || isDigit(this.peek()) || isSymbol(this.peek())) this.advance()
    return this.makeToken(TokenType.IDENTIFIER)
  }

  private keyword() {
    while (isAlpha(this.peek()) || isDigit(this.peek())) this.advance()
    return this.makeToken(TokenType.KEYWORD)
  }

  private number() {
    while (isDigit(this.peek())) this.advance()

    if (this.peek() === '.' && isDigit(this.peekNext())) {
      this.advance()
      while (isDigit(this.peek())) this.advance()
      return this.makeToken(TokenType.FLOAT_NUMBER)
    } else if (this.peek() === '/' && isDigit(this.peekNext())) {
      this.advance()
      while (isDigit(this.peek())) this.advance()
      return this.makeToken(TokenType.FRACTION_NUMBER)
    }

    return this.makeToken(TokenType.INTEGER_NUMBER)
  }

  private string() {
    while (this.peek() !== '"' && !this.isEnd()) {
      if (this.peek() === '\n') this.line += 1
      this.advance()
    }
    if (this.isEnd()) return this.errorToken('Unterminated string')
    this.advance()
    return this.makeStringToken()
  }

  private skipWhitespace() {
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
          while (this.peek() !== '\n' && !this.isEnd()) this.advance()
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

    if ((isAlpha(char) || isSymbol(char)) && !isDigit(this.peek())) {
      return this.identifier()
    }

    if (isDigit(char) || (char === '-' && isDigit(this.peek()))) {
      return this.number()
    }

    switch (char) {
      case '(':
        return this.makeToken(TokenType.LEFT_PAREN)
      case ')':
        return this.makeToken(TokenType.RIGHT_PAREN)
      case '{':
        return this.makeToken(TokenType.LEFT_BRACE)
      case '}':
        return this.makeToken(TokenType.RIGHT_BRACE)
      case '[':
        return this.makeToken(TokenType.LEFT_SQUARE)
      case ']':
        return this.makeToken(TokenType.RIGHT_SQUARE)
      case ':':
        return this.keyword()
      case '"':
        return this.string()
    }

    return this.errorToken('Unexpected character.')
  }
}

///

const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9'

const isAlpha = (c: string) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'

const isSymbol = (c: string) => '=+-*/\\&%$_!<>?'.includes(c)
