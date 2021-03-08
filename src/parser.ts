import { Scanner } from './scanner'
import { Literal, LiteralType, LiteralTypeMap } from './dataTypes/Literal'
import { identity, reduceLiterals } from './utils/fn'
import { defaultLiterals } from './utils/defaultLiterals'
import { Token, TokenType } from './dataTypes/Token'
import { SnippetPosition } from './dataTypes/SnippetPosition'

interface ParseError {
  position: SnippetPosition
  message: string
}

interface ParserResult {
  program: Literal<LiteralType>[]
  errors: ParseError[]
  hasError: boolean
}

///

export const FN_IDENTIFIER = 'fn'
export const VECTOR_IDENTIFIER = 'Vector'
export const MAP_IDENTIFIER = 'HashMap'

///

export class Parser {
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private _program: Literal<LiteralType>[] = []
  private _errors: ParseError[] = []
  private dispatchMode = false

  public constructor(private scanner: Scanner, private literals = defaultLiterals) {}

  public parse(): ParserResult {
    try {
      this.checkLiteralParsers()
      this.advance()
      while (!this.isEnd()) {
        const exp = this.expression()
        if (exp) {
          this._program.push(exp)
        }
      }
      this.consume(TokenType.EOF, 'Expect end of program.')
    } finally {
      return {
        hasError: this.hadError,
        program: this.program,
        errors: this.errors,
      }
    }
  }

  public get program(): Literal<LiteralType>[] {
    return this._program
  }

  public get errors(): ParseError[] {
    return this._errors
  }

  ///

  private advance(): void {
    while (true) {
      this.current = this.scanner.scanToken()
      if (this.current.type !== TokenType.Error) break

      this.errorAtCurrent(this.current.value)
    }
  }

  private consume(type: TokenType, message: string): void {
    if (this.current.type == type) {
      this.advance()
      return
    }

    this.errorAtCurrent(message)
  }

  private errorAtCurrent(message: string): void {
    this.errorAt(this.current, message)
  }

  private errorAt(token: Token, message: string): void {
    if (this.panicMode) return
    this._errors.push({
      position: token.position,
      message,
    })
    this.hadError = true
    throw new Error(message)
  }

  private isEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  private peek(): Token {
    return this.current
  }

  private expression(): Literal<LiteralType> | undefined {
    const token = this.current
    const { Bool, FractionNumber, Int, Float, String } = this.literals

    switch (token.type) {
      case TokenType.True:
        return this.makeLiteral(LiteralType.Boolean, Bool.parser, token)
      case TokenType.False:
        return this.makeLiteral(LiteralType.Boolean, Bool.parser, token)
      case TokenType.Integer:
        return this.makeLiteral(LiteralType.Integer, Int.parser, token)
      case TokenType.Float:
        return this.makeLiteral(LiteralType.Float, Float.parser, token)
      case TokenType.FractionNumber:
        return this.makeLiteral(LiteralType.FractionNumber, FractionNumber.parser, token)
      case TokenType.String:
        return this.makeLiteral(LiteralType.String, String.parser, token)
      case TokenType.Identifier:
        return this.makeLiteral(LiteralType.Identifier, identity, token)
      case TokenType.Keyword:
        return this.makeLiteral(LiteralType.Keyword, String.parser, token)
      case TokenType.LeftParen:
        return new Literal(LiteralType.List, this.advanceUntil(TokenType.RightParen), token.position)
      case TokenType.LeftSquare:
        return new Literal(
          LiteralType.List,
          [
            new Literal(LiteralType.Identifier, VECTOR_IDENTIFIER, token.position),
            ...this.advanceUntil(TokenType.RightSquare),
          ],
          token.position,
        )
      case TokenType.LeftBrace:
        return new Literal(
          LiteralType.List,
          [
            new Literal(LiteralType.Identifier, MAP_IDENTIFIER, token.position),
            ...this.advanceUntil(TokenType.RightBrace),
          ],
          token.position,
        )
      case TokenType.Dispatch:
        return this.formatDispatch()
      default:
        this.errorAtCurrent(`Unknown token: '${token.value}'.`)
        return undefined
    }
  }

  private makeLiteral<Kind extends keyof LiteralTypeMap>(
    literalType: Kind,
    parserFn: (val: string) => LiteralTypeMap[Kind],
    token: Token,
  ): Literal<Kind> {
    const literal = new Literal(literalType, parserFn(this.current.value), token.position)
    this.advance()
    return literal
  }

  private advanceUntil(endToken: TokenType): Literal<LiteralType>[] {
    const literals = [] as Literal<LiteralType>[]
    this.advance()
    for (;;) {
      if (this.current.type === endToken || this.isEnd()) break
      const exp = this.expression() as any
      literals.push(exp)
    }
    this.consume(endToken, `Expected '${this.closeParentheses(endToken)}'.`)
    return literals
  }

  private formatDispatch(): Literal<LiteralType.List> {
    this.advance()

    if (this.dispatchMode) {
      this.errorAtCurrent(`Nested dispatch expression not allowed.`)
    }

    this.dispatchMode = true
    const expression = this.expression()
    if (!expression || expression.kind !== LiteralType.List) {
      this.errorAtCurrent(`List expression expected after dispatch, but get '${expression && expression.kind}'.`)
    }
    const body = expression as Literal<LiteralType.List>
    let newExpression = body
    switch (body.value[0].value) {
      case MAP_IDENTIFIER:
        this.errorAtCurrent('Invalid dispatch: #{...}.')
        break
      case VECTOR_IDENTIFIER:
        this.errorAtCurrent('Invalid dispatch: #[...].')
        break
      default:
        newExpression = this.anonymousFunction(body)
    }
    this.dispatchMode = false
    return newExpression
  }

  private anonymousFunction(body: Literal<LiteralType.List>): Literal<LiteralType.List> {
    const numberOfArgs = reduceLiterals(body, (acc: number[], l: Literal<LiteralType>) => {
      if (l.kind === LiteralType.Identifier) {
        const ll = l as Literal<LiteralType.Identifier>
        if (/^%\d+$/.test(ll.value)) {
          acc.push(parseInt(ll.value.substr(1)))
        }
      }
      return acc
    })
      .sort((a, b) => a - b)
      .reverse()[0]

    const argsIds = Array.from(
      { length: numberOfArgs },
      (_value, key) => new Literal(LiteralType.Identifier, `%${key + 1}`, body.position),
    )
    const args = new Literal(
      LiteralType.List,
      [new Literal(LiteralType.Identifier, VECTOR_IDENTIFIER, body.position), ...argsIds],
      body.position,
    )
    return new Literal(
      LiteralType.List,
      [new Literal(LiteralType.Identifier, FN_IDENTIFIER, body.position), args, body],
      body.position,
    )
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

  private missingParser = (name: string): void => {
    this.errorAtCurrent(`Missing parser '${name}'.`)
  }

  private checkLiteralParsers(): void {
    const { Bool, FractionNumber, Int, Float, String } = this.literals
    Bool.parser || this.missingParser('Bool')
    Int.parser || this.missingParser('Int')
    Float.parser || this.missingParser('Float')
    FractionNumber.parser || this.missingParser('FractionNumber')
    String.parser || this.missingParser('String')
  }
}
