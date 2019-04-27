import { Scanner, Token, TokenType } from './scanner'
import { FractionNumber } from './dataTypes/FractionNumber'

export enum LiteralType {
  Integer,
  Float,
  Fraction,
  String,
  Keyword,
  Identifier,
  List,
  Array
}

interface Atom {}

export class Literal<T> implements Atom {
  constructor(public kind: LiteralType, public value: T) {}
}

export class Parser {
  private scanner: Scanner
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private previous = Token.INIT
  private _expressions: Literal<any>[] = []
  constructor(source: string) {
    this.scanner = new Scanner(source)
  }

  public parse() {
    this.advance()
    while (!this.isEnd()) {
      const exp = this.expression()
      if (exp === undefined) {
        this.error('Unknown token')
      } else {
        this._expressions.push(exp)
      }
      this.advance()
    }

    this.consume(TokenType.EOF, 'Expect end of program.')
    return !this.hadError
  }

  get expressions(): Literal<any>[] {
    return this._expressions
  }

  private advance() {
    this.previous = this.current

    while (true) {
      this.current = this.scanner.scanToken()
      if (this.current.type !== TokenType.ERROR) break

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

    this.panicMode = true
    let snippet = ''

    switch (token.type) {
      case TokenType.EOF:
        snippet = ' at end'
        break
      case TokenType.ERROR:
        break
      default:
        snippet = ` at ${token.value}`
    }

    console.error(`[line ${token.line}]${snippet}: ${message}`)
    this.hadError = true
  }

  private isEnd() {
    return this.peek().type === TokenType.EOF
  }

  private peek() {
    return this.current
  }

  private expression(): Literal<any> | undefined {
    const token = this.current
    switch (token.type) {
      case TokenType.INTEGER_NUMBER:
        return new Literal(LiteralType.Integer, parseInt(token.value, 10))
      case TokenType.FLOAT_NUMBER:
        return new Literal(LiteralType.Float, parseFloat(token.value))
      case TokenType.FRACTION_NUMBER:
        return new Literal(LiteralType.Fraction, FractionNumber.parse(token.value))
      case TokenType.STRING:
        return new Literal(LiteralType.String, token.value)
      case TokenType.IDENTIFIER:
        return new Literal(LiteralType.Identifier, token.value)
      case TokenType.LEFT_PAREN:
        return this.listLikeExpression(LiteralType.List, TokenType.RIGHT_PAREN)
      case TokenType.LEFT_SQUARE:
        return this.listLikeExpression(LiteralType.Array, TokenType.RIGHT_SQUARE)
      default:
        return undefined
    }
  }

  private listLikeExpression(literalType: LiteralType, endToken: TokenType) {
    const expressions = []
    for (;;) {
      this.advance()
      if (this.current.type === endToken || this.isEnd()) {
        break
      }
      expressions.push(this.expression())
    }
    this.consume(endToken, "Expected ')'.")
    return new Literal(literalType, expressions)
  }
}
