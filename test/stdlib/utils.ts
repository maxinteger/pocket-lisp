import { Interpreter, InterpreterOptions } from '../../src/interpreter'
import { Parser, Scanner } from '../../src'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']) =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
