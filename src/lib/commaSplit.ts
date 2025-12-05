import {Transform} from 'node:stream';

export class CommaSplit extends Transform {
	private buf = '';

	constructor() {
		super({readableObjectMode: true});
	}

	override _transform(
		chunk: Buffer,
		_enc: BufferEncoding,
		callback: () => void,
	) {
		this.buf += chunk.toString('utf8');
		const parts = this.buf.split(',');
		this.buf = parts.pop() ?? ''; // keep the trailing partial
		for (const part of parts) {
			this.push(part); // emit each token
		}
		callback();
	}

	override _flush(callback: () => void) {
		if (this.buf.length > 0) this.push(this.buf);
		callback();
	}
}
