import { Interpreter, InterpreterOptions } from 'interpreter'
import { Parser } from 'parser'
import { Scanner } from 'scanner'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']) =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
