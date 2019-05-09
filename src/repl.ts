import * as repl from 'repl'
import { REPLServer } from 'repl'
import { Context } from 'vm'
import { Interpreter } from 'interpreter'
import { Parser } from 'parser'
import { Scanner } from 'scanner'
import { StdoutManager } from 'dataTypes/StdoutManager'
import { def } from 'stdlib/core/def'
import { List } from 'stdlib/data/list'

function createEval() {
  const output = new StdoutManager()
  const interpreter = new Interpreter({
    globals: {
      def,
      List
    },
    stdout: output.cb
  })

  return function pocketLispEval(
    this: REPLServer,
    evalCmd: string,
    _context: Context,
    _file: string,
    cb: (err: Error | null, result: any) => void
  ) {
    const parserResult = new Parser(new Scanner(evalCmd)).parse()
    if (!parserResult.hasError) {
      try {
        const res = interpreter.interpret(parserResult.program)
        const stdOut = output.read()
        if (stdOut) cb(null, stdOut)
        cb(null, res)
      } catch (e) {
        cb(e, null)
      }
    } else {
      cb(new Error(parserResult.errors[0].message), null)
    }
  }
}

repl.start({ prompt: 'pl> ', eval: createEval() })
