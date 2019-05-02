import {Interpreter} from './interpreter'

export interface PLCallable {
	call: (iInterpreter: Interpreter, args: any[]) => any
	arity: () => number
	toString: () => string
}
