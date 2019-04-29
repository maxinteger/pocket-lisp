import {Interpreter} from './Interpreter'

export interface PLCallable {
	call: (iInterpreter: Interpreter, args: any[]) => any
	arity: () => number
	toString: () => string
}
