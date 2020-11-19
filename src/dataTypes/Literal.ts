import { SnippetPosition } from './SnippetPosition'

export enum LiteralType {
  Boolean = 'bool',
  Integer = 'int',
  Float = 'float',
  FractionNumber = 'fractionNumber',
  String = 'string',
  Keyword = 'keyword',
  Identifier = 'identifier',
  List = 'list',
}

export interface LiteralTypeMap {
  bool: boolean
  int: number
  float: number
  fractionNumber: string
  string: string
  keyword: string
  identifier: string
  list: Literal<LiteralType>[]
}

export class Literal<Kind extends keyof LiteralTypeMap> {
  public constructor(public kind: Kind, public value: LiteralTypeMap[Kind], public position: SnippetPosition) {}
}
