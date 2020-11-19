export class SnippetPosition {
  static unknown = new SnippetPosition('', -1, -1, -1)

  private offset: number | undefined = undefined

  constructor(
    public readonly source: string,
    public readonly startIndex: number,
    public readonly endIndex: number,
    public readonly line: number,
  ) {}

  get start(): number {
    return this.startIndex - (this.line <= 1 ? 0 : this.getLineOffset())
  }

  get end(): number {
    return this.endIndex - (this.line <= 1 ? 0 : this.getLineOffset())
  }

  get length(): number {
    return this.endIndex - this.startIndex
  }

  private getLineOffset() {
    if (this.offset === undefined) {
      const re = new RegExp(`(\n)`, `mg`)
      let result: RegExpExecArray | null = null
      for (let i = 1; i < this.line; i++) {
        result = re.exec(this.source)
      }
      this.offset = result?.index ?? 0
    }
    return this.offset
  }
}
