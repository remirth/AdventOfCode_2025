import assert from "node:assert";
import { createReadStream } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";

async function process(inputFile: string, version: 1 | 2) {
	const rl = createInterface(createReadStream(inputFile));

	let state = 50;
	let count = 0;

	for await (const cmd of rl) {
		const op = cmd[0] ?? "";
		const n = Number.parseInt(cmd.slice(1), 10);
		assert(!Number.isNaN(n), "TurnCount is NaN");
		assert.match(op, /^[LR]$/, "Operator is neither L nor R");

		for (let i = 0; i < n; i++) {
			if (op === "R") {
				state += 1;
				if (state === 100) {
					state = 0;
				}
			} else {
				state -= 1;
				if (state === -1) {
					state = 99;
				}
			}

			if (state === 0 && version === 2) {
				count++;
			}
		}

		if (state === 0 && version === 1) {
			count++;
		}
	}

	return count;
}

console.log({
	example_one: await process(path.join(import.meta.dirname, "example.txt"), 1),
	one: await process(path.join(import.meta.dirname, "input.txt"), 1),
	example_two: await process(path.join(import.meta.dirname, "example.txt"), 2),
	two: await process(path.join(import.meta.dirname, "input.txt"), 2),
});
