import { RuntimeError } from 'lang/dataTypes/RuntimeError'
import { Literal, LiteralType } from 'lang/parser'
import { PLCallable } from 'lang/types'
import { Interpreter } from 'lang/interpreter'
import { NATIVE_FN_NAME } from 'lang/utils/constants'
import { Environment } from 'lang/dataTypes/Environment'

export const identity: <T>(x: T) => T = x => x

export const always: <T>(x: T) => () => T = x => () => x

export const assert = (val: boolean, msg: string) => {
  if (val) throw new RuntimeError(msg)
  return true
}

export const assetParamLength = (args: any[], expected: number, msg?: string) =>
  assert(
    args.length !== expected,
    msg || `Expected ${expected} argument(s), but got ${args.length}`
  )

export const assertParamType = (literal: Literal<unknown>, ...types: LiteralType[]) =>
  assert(
    types.find(t => t === literal.kind) === undefined,
    `Invalid function parameter, actual: '${literal.kind}', expected: '${types.join(' or ')}'`
  )

const plCallablePops = {
	configurable: false,
	writable: false,
	enumerable: false
}

export const createFn = (
  fn: (interpreter: Interpreter, env: Environment, parameters: Literal<unknown>[]) => any,
  args: number,
	representation?: string
): PLCallable => {
	return Object.create(null, {
		call: {
			...plCallablePops,
			value: fn
		},
		arity: {
			...plCallablePops,
			value: args
		},
		toString: {
			...plCallablePops,
			value: () => representation || NATIVE_FN_NAME
		}
	})
}

export const simpleFn = (fn: (...args: any[]) => any): PLCallable => createFn(
	(interpreter, env, parameters) => {
		const evaluatedParams = parameters.map(p => interpreter.execLiteral(p, env), interpreter)
		return fn.apply(null, evaluatedParams)
	},
	fn.length
)
