import { Interpreter, Parser, Scanner } from 'lang'
import { literals, runtime } from 'stdlib/index'
import { expect } from 'chai'
import { plNumber } from 'stdlib/data/PLNumber'

describe('stdlib', () => {
  it('should be compatible with the interpreter', () => {
    const interpreter = new Interpreter(
      {
        globals: {...runtime, ...{
            print1: (output: any) => expect(output).deep.equals(plNumber(3)),
            print2: (output: any) => expect(output).deep.equals(plNumber(7))
          }}
      },
      literals
    )
    const programCode = `
      (def x (fn [a b] (+ a b)))
      
      (print1 (x 1 2))
      (def a (+ 5))
      (print2 (a 2))
    `

    const parserResult = new Parser(new Scanner(programCode), literals).parse()
		interpreter.interpret(parserResult.program)
  })
})
