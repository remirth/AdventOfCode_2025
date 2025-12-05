import assert from 'node:assert';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {chunkString, getIntegerInString} from '../lib/chunk.ts';
import {CommaSplit} from '../lib/commaSplit.ts';

async function process(inputFile: string, customLength?: number) {
	const input = createReadStream(inputFile).pipe(new CommaSplit());

	let sum = 0;
	let i = 0;
	let delimiterIndex = 0;
	let start = 0;
	let end = 0;
	let token = '';

	let j: number;
	let currentChunk: string;
	let matches = true;
	let found = false;
	let chunkLength = 0;
	for await (const range of input) {
		delimiterIndex = range.indexOf('-');
		assert.notEqual(delimiterIndex, -1, 'Range does not contain delimiter');
		start = getIntegerInString(range, 0, delimiterIndex);
		end = getIntegerInString(range, delimiterIndex + 1);

		for (i = start; i <= end; ++i) {
			token = String(i);

			found = false;
			j = customLength != null ? customLength : token.length;

			while (j > 1 && !found) {
				currentChunk = '';
				chunkLength = token.length / j;
				matches = true;

				for (const chunk of chunkString(token, chunkLength)) {
					if (currentChunk === '' && chunk.length === chunkLength) {
						currentChunk = chunk;
					} else if (currentChunk !== chunk) {
						matches = false;
					}
				}

				found = matches;

				j--;
			}

			if (found) {
				sum += i;
			}
		}
	}

	return sum;
}

const input = path.join(import.meta.dirname, 'input.txt');
const example = path.join(import.meta.dirname, 'example.txt');

const data = {
	example_one: await process(example, 2),
	one: await process(input, 2),
	example_two: await process(example),
	two: await process(input),
};

console.log(data);
assert.equal(data.example_one, 1227775554, 'Example one');
assert.equal(data.example_two, 4174379265, 'Example two');
