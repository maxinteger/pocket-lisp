import { Interpreter, Parser, Scanner } from '../src'
import { expect } from 'chai'
import { InterpreterOptions, nativeFn } from '../src/interpreter'

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
      { globals: { print: nativeFn(output => expect(output).equals(3)) } }
    )
  })
})
