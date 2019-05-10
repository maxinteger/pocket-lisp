import { Scanner, Token, TokenType } from 'scanner'
import { FractionNumber } from 'dataTypes/FractionNumber'
import { always, identity } from 'utils/fn'

export enum LiteralType {
  Boolean = 'bool',
  Integer = 'int',
  Float = 'float',
  Fraction = 'fraction',
  String = 'string',
  Keyword = 'keyword',
  Identifier = 'identifier',
  List = 'list'
}

interface Atom {}

export class Literal<T> implements Atom {
  constructor(public kind: LiteralType, public value: T) {}
}

interface ParseError {
  line: number
  message: string
  start?: number
  end?: number
}

interface ParserResult {
  program: Literal<unknown>[]
  errors: ParseError[]
  hasError: boolean
}

///

export const LIST_IDENTIFIER = new Literal(LiteralType.Identifier, 'List')

///

export class Parser {
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private previous = Token.INIT
  private _program: Literal<unknown>[] = []
  private _errors: ParseError[] = []

  constructor(private scanner: Scanner) {}

  public parse(): ParserResult {
    try {
      this.advance()
      while (!this.isEnd()) {
        const exp = this.expression()
        if (exp === undefined) {
          this.error('Unknown token')
        } else {
          this._program.push(exp)
        }
      }
      this.consume(TokenType.EOF, 'Expect end of program.')
    } finally {
      return {
        hasError: this.hadError,
        program: this.program,
        errors: this.errors
      }
    }
  }

  get program(): Literal<unknown>[] {
    return this._program
  }

  get errors(): ParseError[] {
    return this._errors
  }

  ///

  private advance() {
    this.previous = this.current

    while (true) {
      this.current = this.scanner.scanToken()
      if (this.current.type !== TokenType.Error) break

      this.errorAtCurrent(this.current.value)
    }
  }

  private consume(type: TokenType, message: string) {
    if (this.current.type == type) {
      this.advance()
      return
    }

    this.errorAtCurrent(message)
  }

  private error(message: string) {
    this.errorAt(this.previous, message)
  }

  private errorAtCurrent(message: string) {
    this.errorAt(this.current, message)
  }

  private errorAt(token: Token, message: string) {
    if (this.panicMode) return
    this._errors.push({
      line: token.line,
      message
    })
    this.hadError = true
    throw new Error(message)
  }

  private isEnd() {
    return this.peek().type === TokenType.EOF
  }

  private peek() {
    return this.current
  }

  private expression(): Literal<unknown> | undefined {
    const token = this.current
    switch (token.type) {
      case TokenType.True:
        return this.makeLiteral(LiteralType.Boolean, always(true))
      case TokenType.False:
        return this.makeLiteral(LiteralType.Boolean, always(false))
      case TokenType.Integer:
        return this.makeLiteral(LiteralType.Integer, parseInt)
      case TokenType.Float:
        return this.makeLiteral(LiteralType.Float, parseFloat)
      case TokenType.FractionNumber:
        return this.makeLiteral(LiteralType.Fraction, FractionNumber.parse)
      case TokenType.String:
        return this.makeLiteral(LiteralType.String, identity)
      case TokenType.Identifier:
        return this.makeLiteral(LiteralType.Identifier, identity)
      case TokenType.LeftParen:
        return new Literal<unknown>(LiteralType.List, this.advanceUntil(TokenType.RightParen))
      case TokenType.LeftSquare:
        return new Literal<unknown>(LiteralType.List, [
          LIST_IDENTIFIER,
          ...this.advanceUntil(TokenType.RightSquare)
        ])
      default:
        return undefined
    }
  }
  private makeLiteral(literalType: LiteralType, parserFn: (val: string) => unknown): Literal<unknown> {
    const literal = new Literal(literalType, parserFn(this.current.value))
    this.advance()
    return literal
  }

  private advanceUntil(endToken: TokenType): unknown[] {
    const literals = []
    this.advance()
    for (;;) {
      if (this.current.type === endToken || this.isEnd()) break
      literals.push(this.expression())
    }
    this.consume(endToken, `Expected '${this.closeParentheses(endToken)}'.`)
    return literals
  }

  private closeParentheses(tt: TokenType): string | void {
    switch (tt) {
      case TokenType.RightParen:
        return ')'
      case TokenType.RightBrace:
        return '}'
      case TokenType.RightSquare:
        return ']'
    }
  }
}
