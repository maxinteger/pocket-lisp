export class StdoutManager {
	private data = ''

	public cb = (out: string): void => {
		this.data += out
	}

	public read(): unknown {
		const data = this.data
		this.data = ''
		return data
	}
}
