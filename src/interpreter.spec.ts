import { Parser } from './parser'
import { Scanner } from './scanner'
import { Interpreter } from './interpreter'
import { InterpreterOptions } from './types'

const interpret = (src: string, options?: Partial<InterpreterOptions>) =>
  new Interpreter(options).interpret(new Parser(new Scanner(src)).parse().program)

describe('interpreter', () => {
  it('should run an empty program without error', () => {
    const actual = interpret('')
    const expected = undefined
    expect(actual).toBe(expected)
  })

  it('should run simple program', () => {
    const tests = [
      { input: '(print "hello world")', output: 'hello world' },
      { input: '(print 1)', output: 1 },
      { input: '(print 1.2)', output: 1.2 },
      { input: '(print true)', output: true },
      { input: '(print false)', output: false },
    ]
    tests.map(({ input, output }) => {
      interpret(input, {
        globals: {
          print: (res: any) => expect(res).toEqual(output),
        },
      })
    })

    interpret(`(print "hello world")`, {
      globals: { print: (output: any) => expect(output).toBe('hello world') },
    })

    interpret(`(print (+ 1 2))`, {
      globals: {
        print: (output: any) => expect(output).toBe(3),
        '+': (a: any, b: any) => a + b,
      },
    })
  })

  it('should print "[native fn]" if the user print out a global function', () => {
    interpret('(print print)', {
      globals: {
        print: (output: any) => {
          expect(output.arity).toBe(1)
          expect(output.toString()).toBe('<print function>')
        },
      },
    })
  })

  it('should fail if we try to use vector or HashMap with builtin types', () => {
    expect(() => interpret('(print [1 2 3])')).toThrow('Vector is not implemented.')
    expect(() => interpret('(print {"a" 1, "b" 2})')).toThrow('HashMap is not implemented.')
  })

  it('should throw runtime error if the first item of the list expression is not a function', () => {
    expect(() => interpret('(1 + 2)')).toThrow(`'1' is not a function`)
  })

  it('should list names from the global scope via getGlobalNames', () => {
    const interpreter = new Interpreter()
    interpreter.interpret(new Parser(new Scanner(`(def hello-world 10)`)).parse().program)
    expect(interpreter.getGlobalNames()).toEqual([
      'Bool',
      'Int',
      'Float',
      'String',
      'FractionNumber',
      'Vector',
      'HashMap',
      'print',
      'const',
      'def',
      'defn',
      'if',
      'case',
      'fn',
      'do',
      'side-effect',
      'hello-world',
    ])
  })

  it('should work with keywords', () => {
    interpret('(print :key)', {
      globals: {
        print: (output: string) => {
          expect(output).toBe('key')
        },
      },
    })
  })
})
