import { Environment } from 'dataTypes/Environment'
import { Literal, LiteralType } from 'parser'
import { RuntimeError } from 'dataTypes/RuntimeError'
import { nativeFn } from 'stdlib/utils'
import { PLCallable } from 'types'

interface PLLiteral {
  parser: (x: string) => any
  factory: PLCallable
}

export interface InterpreterOptions {
  globals?: { [key: string]: any }
  stdout?: (out: string) => void
  lockedGlobals?: boolean
}

export interface PLLiterals {
  bool: PLLiteral
  int: PLLiteral
  float: PLLiteral
  fractionNumber: PLLiteral
  vector: PLLiteral
  hashMap: PLLiteral
}

const notImplementedLiteral = (name: string): PLLiteral => ({
  parser: () => {
    throw new RuntimeError(`${name} is not implemented`)
  },
  factory: nativeFn(() => {
    throw new RuntimeError(`${name} is not implemented`)
  })
})

const defaultLiterals: PLLiterals = {
  bool: {
    parser: (x: string) => x === 'true',
    factory: nativeFn(Boolean)
  },
  int: {
    parser: (x: string) => parseInt(x, 10),
    factory: nativeFn(Number)
  },
  float: {
    parser: parseFloat,
    factory: nativeFn(Number)
  },
  fractionNumber: notImplementedLiteral('FractionNumber'),
  vector: notImplementedLiteral('Vector'),
  hashMap: notImplementedLiteral('HashMap')
}

const defaultOptions = {
  stdout: undefined,
  lockedGlobals: true,
  globals: <any>{}
}

///

export class Interpreter {
  private readonly globals = new Environment()
  private _currentEnv = this.globals
  constructor(options?: InterpreterOptions, literals?: PLLiterals) {
    const { stdout, globals, lockedGlobals } = { ...defaultOptions, ...options }
    const plLiterals = { ...literals, ...defaultLiterals }

    Object.keys(plLiterals).forEach(key => {
      this.globals.define(key, (plLiterals as any)[key].factory)
    })

    this.globals.define('print', nativeFn(stdout || console.log))

    Object.keys(globals).forEach(key => this.globals.define(key, globals[key], lockedGlobals))
  }

  public interpret(program: Literal<unknown>[]) {
    let returnVal: unknown = undefined
    try {
      for (let literal of program) {
        returnVal = this.execLiteral(literal)
      }
    } catch (e) {
      throw new RuntimeError(e)
    }
    return returnVal
  }

  public execLiteral = (literal: Literal<any>) => {
    switch (literal.kind) {
      case LiteralType.Boolean:
      case LiteralType.Integer:
      case LiteralType.Float:
      case LiteralType.String:
        return literal.value
      case LiteralType.Keyword:
      case LiteralType.Identifier:
        return this._currentEnv.get(literal.value)
      case LiteralType.List:
        return this.execList(literal)
    }
  }

  private execList(literal: Literal<Literal<unknown>[]>): unknown {
    const [fnId, ...args] = literal.value
    if (fnId.kind === LiteralType.Identifier) {
      const fn = <PLCallable>this._currentEnv.get((fnId as Literal<string>).value)
      return fn.call(this, args)
    }
    throw new RuntimeError(`'${fnId.value}' is not a function`)
  }

  get currentEnv(): Environment {
    return this._currentEnv
  }
}
