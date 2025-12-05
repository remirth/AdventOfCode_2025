import assert from 'node:assert';
import {Transform, type TransformCallback} from 'node:stream';

export class SplitStream extends Transform {
	private buf = '';

	constructor(readonly delimiter: string) {
		super({readableObjectMode: true});
		assert.strictEqual(
			delimiter.length,
			1,
			'Tried to create a SplitStream with a delimiter of invalid length',
		);
	}

	override _transform(
		chunk: Buffer,
		_enc: BufferEncoding,
		callback: TransformCallback,
	) {
		this.buf += chunk.toString('utf8');

		let last = 0;
		for (let i = 0; i < this.buf.length; ++i) {
			if (this.buf[i] === this.delimiter) {
				this.push(this.buf.slice(last, i).trim());
				last = i + 1;
			}
		}

		this.buf = this.buf.slice(last).trim();
		callback();
	}

	override _flush(callback: TransformCallback) {
		if (this.buf.length > 0) this.push(this.buf);
		callback();
	}
}
