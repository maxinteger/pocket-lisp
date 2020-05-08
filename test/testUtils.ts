import { Interpreter } from '../src/interpreter'
import { Parser } from '../src/parser'
import { Scanner } from '../src/scanner'
import { InterpreterOptions } from '../src/types'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']) =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
