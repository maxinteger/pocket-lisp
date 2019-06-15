import { Scanner, Token, TokenType } from 'lang/scanner'
import { identity, reduceLiterals } from 'lang/utils/fn'
import { defaultLiterals } from 'lang/utils/defaultLiterals'
import { Literal, LiteralType, LiteralTypeMap } from 'lang/dataTypes/Literal'

interface ParseError {
  line: number
  message: string
  start?: number
  end?: number
}

interface ParserResult {
  program: Literal<LiteralType>[]
  errors: ParseError[]
  hasError: boolean
}

///

export const FN_IDENTIFIER = new Literal(LiteralType.Identifier, 'fn')
export const VECTOR_IDENTIFIER = new Literal(LiteralType.Identifier, 'vector')
export const MAP_IDENTIFIER = new Literal(LiteralType.Identifier, 'hashMap')

///

export class Parser {
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private previous = Token.INIT
  private _program: Literal<LiteralType>[] = []
  private _errors: ParseError[] = []
  private dispatchMode = false

  constructor(private scanner: Scanner, private literals = defaultLiterals) {}

  public parse(): ParserResult {
    try {
      this.checkLiteralParsers()
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

  get program(): Literal<LiteralType>[] {
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

  private expression(): Literal<LiteralType> | undefined {
    const token = this.current
    const { bool, fractionNumber, int, float, string } = this.literals

    switch (token.type) {
      case TokenType.True:
        return this.makeLiteral(LiteralType.Boolean, bool.parser)
      case TokenType.False:
        return this.makeLiteral(LiteralType.Boolean, bool.parser)
      case TokenType.Integer:
        return this.makeLiteral(LiteralType.Integer, int.parser)
      case TokenType.Float:
        return this.makeLiteral(LiteralType.Float, float.parser)
      case TokenType.FractionNumber:
        return this.makeLiteral(LiteralType.FractionNumber, fractionNumber.parser)
      case TokenType.String:
        return this.makeLiteral(LiteralType.String, string.parser)
      case TokenType.Identifier:
        return this.makeLiteral(LiteralType.Identifier, identity)
      case TokenType.LeftParen:
        return new Literal(LiteralType.List, this.advanceUntil(TokenType.RightParen))
      case TokenType.LeftSquare:
        return new Literal(LiteralType.List, [
          VECTOR_IDENTIFIER,
          ...this.advanceUntil(TokenType.RightSquare)
        ])
      case TokenType.LeftBrace:
        return new Literal(LiteralType.List, [
          MAP_IDENTIFIER,
          ...this.advanceUntil(TokenType.RightBrace)
        ])
      case TokenType.Dispatch:
        return this.formatDispatch()
      default:
        return undefined
    }
  }

  private makeLiteral<Kind extends keyof LiteralTypeMap>(
    literalType: Kind,
    parserFn: (val: string) => LiteralTypeMap[Kind]
  ): Literal<Kind> {
    const literal = new Literal(literalType, parserFn(this.current.value))
    this.advance()
    return literal
  }
  private advanceUntil(endToken: TokenType): Literal<LiteralType>[] {
    const literals = [] as Literal<LiteralType>[]
    this.advance()
    for (;;) {
      if (this.current.type === endToken || this.isEnd()) break
      const exp = this.expression() as any
      if (exp) literals.push(exp)
    }
    this.consume(endToken, `Expected '${this.closeParentheses(endToken)}'.`)
    return literals
  }

  private formatDispatch() {
    this.advance()

    if (this.dispatchMode) {
      this.errorAtCurrent(`Nested dispatch expression not allowed.`)
    }

    this.dispatchMode = true
    const expression = this.expression()
    if (!expression || expression.kind !== LiteralType.List) {
      this.errorAtCurrent(
        `List expression expected after dispatch, but get '${expression && expression.kind}'.`
      )
    }
    const body = expression as Literal<LiteralType.List>
    let newExpression = body
    switch (body.value[0].value) {
      case MAP_IDENTIFIER.value:
        this.errorAtCurrent('Invalid dispatch: #[...}.')
        break
      case VECTOR_IDENTIFIER.value:
        this.errorAtCurrent('Invalid dispatch: #[...].')
        break
      default:
        newExpression = this.anonymousFunction(body)
    }
    this.dispatchMode = false
    return newExpression
  }

  private anonymousFunction(body: Literal<LiteralType.List>) {
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
      (_value, key) => new Literal(LiteralType.Identifier, `%${key + 1}`)
    )
    const args = new Literal(LiteralType.List, [VECTOR_IDENTIFIER, ...argsIds])
    return new Literal(LiteralType.List, [FN_IDENTIFIER, args, body])
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

  private missingParser = (name: string) => {
    this.errorAtCurrent(`Missing parser '${name}'.`)
  }

  private checkLiteralParsers() {
    const { bool, fractionNumber, int, float, string } = this.literals
    bool.parser || this.missingParser('bool')
    bool.parser || this.missingParser('bool')
    int.parser || this.missingParser('int')
    float.parser || this.missingParser('float')
    fractionNumber.parser || this.missingParser('fractionNumber')
    string.parser || this.missingParser('string')
  }
}
