import assert from 'node:assert';
export function* chunkString(token: string, length: number) {
	let buf = '';
	for (let i = 0; i < token.length; ++i) {
		buf += token[i];
		if (buf.length === length) {
			yield buf;
			buf = '';
		}
	}

	if (buf) {
		yield buf;
	}
}

export function getIntegerInString(str: string, start?: number, end?: number) {
	const token = start != null ? str.substring(start, end) : str;
	const value = Number.parseInt(token, 10);

	assert.strictEqual(Number.isNaN(value), false, `Value: ${token} is NaN`);
	return value;
}
