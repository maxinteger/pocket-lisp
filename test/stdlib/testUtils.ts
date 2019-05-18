import { Interpreter } from 'interpreter'
import { Parser } from 'parser'
import { Scanner } from 'scanner'
import { InterpreterOptions } from 'types'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']) =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
