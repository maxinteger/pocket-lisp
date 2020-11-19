import { SnippetPosition } from './SnippetPosition'

export enum TokenType {
  Init,
  LeftParen,
  RightParen,
  LeftBrace,
  RightBrace,
  LeftSquare,
  RightSquare,
  Dispatch,
  True,
  False,
  Identifier,
  Keyword,
  String,
  Integer,
  Float,
  FractionNumber,
  Error,
  EOF,
}

export class Token {
  public constructor(public type: TokenType, public value: string, public position: SnippetPosition) {}

  public static INIT = new Token(TokenType.Init, '', new SnippetPosition('', 0, 0, 0))
}
