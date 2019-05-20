import * as repl from 'repl'
import { REPLServer } from 'repl'
import { Context } from 'vm'
import { Interpreter } from 'interpreter'
import { Parser } from 'parser'
import { Scanner } from 'scanner'
import { StdoutManager } from 'dataTypes/StdoutManager'
import { literals, runtime } from 'stdlib/'

function createEval() {
  const output = new StdoutManager()
  const interpreter = new Interpreter(
    {
      globals: runtime,
      stdout: (value) => output.cb(value.toString())
    },
    literals
  )

  return function pocketLispEval(
    this: REPLServer,
    evalCmd: string,
    _context: Context,
    _file: string,
    callback: (err: Error | null, result: any) => void
  ) {
    const parserResult = new Parser(new Scanner(evalCmd), literals).parse()
    if (!parserResult.hasError) {
      try {
        const res: any = interpreter.interpret(parserResult.program)
        const stdOut = output.read()

        if (stdOut) callback(null, stdOut)
        callback(null, res.toString())
      } catch (e) {
        callback(e, null)
      }
    } else {
      callback(new Error(parserResult.errors[0].message), null)
    }
  }
}

repl.start({ prompt: 'pl> ', eval: createEval() })
