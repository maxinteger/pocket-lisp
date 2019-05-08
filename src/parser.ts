import { Scanner, Token, TokenType } from './scanner'
import { FractionNumber } from './dataTypes/FractionNumber'
import { always, identity } from './utils/fn'

export enum LiteralType {
  Boolean = 'bool',
  Integer = 'int',
  Float = 'float',
  Fraction = 'fraction',
  String = 'string',
  Keyword = 'keyword',
  Identifier = 'identifier',
  List = 'list',
  Array = 'array'
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
  program: Literal<any>[]
  errors: ParseError[]
  hasError: boolean
}

///

export class Parser {
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private previous = Token.INIT
  private _program: Literal<any>[] = []
  private _errors: ParseError[] = []

  constructor(private scanner: Scanner) {}

  public parse(): ParserResult {
    try {
      this.advance()
      while (!this.isEnd()) {
        const exp = this.expression()
        if (exp === undefined) {
          this.error('Unknown token')
          break
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

  get program(): Literal<any>[] {
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

  private expression(): Literal<any> | undefined {
    const token = this.current
    switch (token.type) {
      case TokenType.TRUE:
        return this.makeLiteral(LiteralType.Boolean, always(true))
      case TokenType.FALSE:
        return this.makeLiteral(LiteralType.Boolean, always(false))
      case TokenType.INTEGER_NUMBER:
        return this.makeLiteral(LiteralType.Integer, parseInt)
      case TokenType.FLOAT_NUMBER:
        return this.makeLiteral(LiteralType.Float, parseFloat)
      case TokenType.FRACTION_NUMBER:
        return this.makeLiteral(LiteralType.Fraction, FractionNumber.parse)
      case TokenType.STRING:
        return this.makeLiteral(LiteralType.String, identity)
      case TokenType.IDENTIFIER:
        return this.makeLiteral(LiteralType.Identifier, identity)
      case TokenType.LEFT_PAREN:
        return this.makeListCollection(LiteralType.List, TokenType.RIGHT_PAREN)
      case TokenType.LEFT_SQUARE:
        return this.makeListCollection(LiteralType.Array, TokenType.RIGHT_SQUARE)
      default:
        return undefined
    }
  }
  private makeLiteral(
    literalType: LiteralType,
    parserFn: (val: string) => any
  ): Literal<any> {
    const literal = new Literal(literalType, parserFn(this.current.value))
    this.advance()
    return literal
  }

  private makeListCollection(literalType: LiteralType, endToken: TokenType) {
    const expressions = []
    this.advance()
    for (;;) {
      if (this.current.type === endToken || this.isEnd()) {
        break
      }
      expressions.push(this.expression())
    }
    this.consume(endToken, `Expected '${this.closeParentheses(endToken)}'.`)
    return new Literal(literalType, expressions)
  }

  private closeParentheses(tt: TokenType) {
    switch (tt) {
      case TokenType.RIGHT_PAREN:
        return ')'
      case TokenType.RIGHT_BRACE:
        return '}'
      case TokenType.RIGHT_SQUARE:
        return ']'
      default:
        return ''
    }
  }
}
