import { Scanner, Token, TokenType } from 'lang/scanner'
import { identity, reduceLiterals } from 'lang/utils/fn'
import { defaultLiterals } from 'lang/utils/defaultLiterals'

export enum LiteralType {
  Boolean = 'bool',
  Integer = 'int',
  Float = 'float',
  FractionNumber = 'fractionNumber',
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

export const FN_IDENTIFIER = new Literal(LiteralType.Identifier, 'fn')
export const VECTOR_IDENTIFIER = new Literal(LiteralType.Identifier, 'vector')
export const MAP_IDENTIFIER = new Literal(LiteralType.Identifier, 'hashMap')

///

export class Parser {
  private hadError = false
  private panicMode = false
  private current = Token.INIT
  private previous = Token.INIT
  private _program: Literal<unknown>[] = []
  private _errors: ParseError[] = []
  private dispatchMode = false

  constructor(private scanner: Scanner, private literals = defaultLiterals) {}

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

  private missingParser = (name: string) => () => {
    this.errorAtCurrent(`Missing parser '${name}'.`)
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
    const { bool, fractionNumber, int, float, string } = this.literals

    switch (token.type) {
      case TokenType.True:
        return this.makeLiteral(LiteralType.Boolean, bool.parser || this.missingParser('bool'))
      case TokenType.False:
        return this.makeLiteral(LiteralType.Boolean, bool.parser || this.missingParser('bool'))
      case TokenType.Integer:
        return this.makeLiteral(LiteralType.Integer, int.parser || this.missingParser('int'))
      case TokenType.Float:
        return this.makeLiteral(LiteralType.Float, float.parser || this.missingParser('float'))
      case TokenType.FractionNumber:
        return this.makeLiteral(
          LiteralType.FractionNumber,
          fractionNumber.parser || this.missingParser('plFractionNumber')
        )
      case TokenType.String:
        return this.makeLiteral(LiteralType.String, string.parser || this.missingParser('string'))
      case TokenType.Identifier:
        return this.makeLiteral(LiteralType.Identifier, identity)
      case TokenType.LeftParen:
        return new Literal<unknown>(LiteralType.List, this.advanceUntil(TokenType.RightParen))
      case TokenType.LeftSquare:
        return new Literal<unknown>(LiteralType.List, [
          VECTOR_IDENTIFIER,
          ...this.advanceUntil(TokenType.RightSquare)
        ])
      case TokenType.LeftBrace:
        return new Literal<unknown>(LiteralType.List, [
          MAP_IDENTIFIER,
          ...this.advanceUntil(TokenType.RightBrace)
        ])
      case TokenType.Dispatch:
        return this.formatDispatch()
      default:
        return undefined
    }
  }
  private makeLiteral(
    literalType: LiteralType,
    parserFn: (val: string) => unknown
  ): Literal<unknown> {
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
    const body = expression as Literal<Literal<any>[]>
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

  private anonymousFunction(body: Literal<Literal<any>[]>) {
    const numberOfArgs = reduceLiterals(body, (acc: number[], l: Literal<any>) => {
      if (l.kind === LiteralType.Identifier && /^%\d+$/.test(l.value)) {
        acc.push(parseInt(l.value.substr(1)))
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
}
