export class RuntimeError extends Error {
  public constructor(error: Error | string) {
    if (typeof error === 'string') {
  		super(error)
    } else {
    	super(error.message)
    	this.stack = error.stack
		}
  }
}
