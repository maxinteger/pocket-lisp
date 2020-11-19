import { SnippetPosition } from './SnippetPosition'

export class RuntimeError extends Error {
  static kind = 'RuntimeError'

  private readonly _position: SnippetPosition | undefined

  public constructor(error: Error | string, position?: SnippetPosition) {
    if (typeof error === 'string') {
      super(error)
    } else {
      super(error.message)
      this.stack = error.stack
    }

    this._position = position
  }

  get position(): SnippetPosition | undefined {
    return this._position
  }
}
