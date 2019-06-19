import { Scanner } from 'lang/scanner'
import { Parser } from 'lang/parser'
import { Interpreter } from 'lang/interpreter'
import { InterpreterOptions, PLLiterals } from 'lang/types'

export { Scanner } from 'lang/scanner'
export { Parser } from 'lang/parser'
export { Interpreter } from 'lang/interpreter'

enum ErrorTypes {
  Parser = 'Parser',
  Runtime = 'Runtime'
}

export class PocketLisp {
  private readonly literals: PLLiterals | undefined
  private readonly interpreter: Interpreter

  public constructor(options?: Partial<InterpreterOptions>, literals?: PLLiterals) {
    this.literals = literals
    this.interpreter = new Interpreter(options, literals)
  }

  public async execute(source: string): Promise<any> {
    const scanner = new Scanner(source)
    const parser = new Parser(scanner, this.literals)
    const parserResult = parser.parse()

    if (parserResult.hasError) {
      throw { type: ErrorTypes.Parser, errors: parserResult.errors }
    } else {
      try {
        this.interpreter.interpret(parserResult.program)
      } catch (error) {
        throw { type: ErrorTypes.Runtime, errors: [{ message: error.message }] }
      }
    }
  }
}
