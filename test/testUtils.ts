import { Interpreter } from 'lang/interpreter'
import { Parser } from 'lang/parser'
import { Scanner } from 'lang/scanner'
import { InterpreterOptions } from 'lang/types'

export const initInterpret = (src: string, globals: InterpreterOptions['globals']) =>
  new Interpreter({ globals }).interpret(new Parser(new Scanner(src)).parse().program)
