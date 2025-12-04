import assert from "node:assert";
import { createReadStream } from "node:fs";
import path from "node:path";
import { createInterface as readline } from "node:readline";

async function process(inputFile: string, length: number) {
	const rl = readline(createReadStream(inputFile));

	let sum = 0;
	for await (const line of rl) {
		if (!line.length) continue;
		const vec = new Array<number>(length).fill(0);

		for (let i = 0; i < line.length; ++i) {
			const n = Number.parseInt(line[i] ?? "NaN", 10);
			assert.equal(Number.isNaN(n), false, `${line[i]} is NaN`);
			const isFirstLetter = i === 0;

			for (let j = 0; j < length; ++j) {
				// biome-ignore lint/style/noNonNullAssertion: We filled vec earlier
				const isLargerThanCurrent = n > vec[j]!;
				const hasLettersLeft = line.length - i >= length - j;

				if (isFirstLetter || (isLargerThanCurrent && hasLettersLeft)) {
					vec[j] = n;
					vec.fill(0, j + 1);

					j = length;
				}
			}
		}

		const value = Number.parseInt(vec.join(""), 10);
		assert.equal(Number.isNaN(value), false, `${vec.join("")} is NaN`);

		sum += value;
	}

	return sum;
}

const input = path.join(import.meta.dirname, "input.txt");
const example = path.join(import.meta.dirname, "example.txt");

const data = {
	example_one: await process(example, 2),
	one: await process(input, 2),
	example_two: await process(example, 12),
	two: await process(input, 12),
};

console.log(data);
assert.equal(data.example_one, 357, "Example one");
assert.equal(data.example_two, 3121910778619, "Example two");
