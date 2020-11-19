import { Interpreter } from '../src'
import { Parser } from '../src'
import { Scanner } from '../src'
import { InterpreterOptions } from '../src'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']): Interpreter =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
