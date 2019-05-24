export class StdoutManager {
	private data = ''

	cb = (out: string) => {
		this.data += out
	}

	read() {
		const data = this.data
		this.data = ''
		return data
	}
}
