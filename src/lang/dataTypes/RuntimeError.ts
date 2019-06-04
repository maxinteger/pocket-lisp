export class RuntimeError extends Error {
  constructor(error: Error | string) {
    if (typeof error === 'string') {
  		super(error)
    } else {
    	super(error.message)
    	this.stack = error.stack
		}
  }
}
