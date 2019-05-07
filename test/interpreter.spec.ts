import { Interpreter, Parser, Scanner } from '../src'
import { expect } from 'chai'
import { InterpreterOptions } from '../src/interpreter'
import { nativeFn } from '../src/stdlib/utils'

const interpret = (src: string, options?: InterpreterOptions) =>
  new Interpreter(options).interpret(new Parser(new Scanner(src)).parse().program)

describe('interpreter', () => {
  it('should run an empty program without error', () => {
    const actual = interpret('')
    const expected = undefined
    expect(actual).equals(expected)
  })

  it('should run simple program', () => {
    interpret(
      `
        (print "hello world")
      `,
      { globals: { print: nativeFn(output => expect(output).equals('hello world')) } }
    )

    interpret(
      `
        (print (+ 1 2))
      `,
      {
        globals: {
          print: nativeFn(output => expect(output).equals(3)),
          '+': nativeFn((a, b) => a + b)
        }
      }
    )
  })

  it('should print "<native fn>" if the user print out a global function', () => {
    interpret('(print print)', {
      globals: {
        print: nativeFn(output => {
          expect(output.arity()).equals(1)
          expect(output.toString()).equals('<native fn>')
        })
      }
    })
  })

  it('should throw runtime error if the fir item of the list expression is not a function', () => {
    expect(() => interpret('(1 + 2)')).throw(`Error: '1' is not a function`)
  })
})
