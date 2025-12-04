export function* chunkString(token: string, length: number) {
	let buf = "";
	for (let i = 0; i < token.length; ++i) {
		buf += token[i];
		if (buf.length === length) {
			yield buf;
			buf = "";
		}
	}

	if (buf) {
		yield buf;
	}
}
