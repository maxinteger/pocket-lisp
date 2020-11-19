import { Scanner } from './scanner'
import { Parser } from './parser'
import { Interpreter } from './interpreter'
import { InterpreterOptions, PLCallable, PLLiterals } from './types'

export { Scanner } from './scanner'
export { Parser } from './parser'
export { Interpreter } from './interpreter'
export { RuntimeError } from './dataTypes/RuntimeError'
export * from './types'

enum ErrorTypes {
  Parser = 'Parser',
  Runtime = 'Runtime',
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
        throw {
          type: ErrorTypes.Runtime,
          errors: [{ message: error.message, position: error.position }],
        }
      }
    }
  }

  public evalFn(fn: PLCallable, args: any[]): unknown {
    return this.interpreter.evalFn(fn, args)
  }
}
