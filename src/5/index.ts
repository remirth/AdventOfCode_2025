/** biome-ignore-all lint/style/noNonNullAssertion: We are sure of our index accessing */
import assert from 'node:assert';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createInterface as readline} from 'node:readline';
import {getIntegerInString} from '../lib/chunk';

async function process(inputFile: string, version: 1 | 2) {
	const rl = readline(createReadStream(inputFile));
	const ranges: Array<{start: number; end: number}> = [];

	let readingRanges = true;

	let count = 0;
	let delimiterIndex = 0;
	let start = 0;
	let end = 0;
	let id = 0;

	for await (const line of rl) {
		if (line.length === 0) {
			if (version === 1) {
				readingRanges = false;
			} else {
				break;
			}
		} else if (readingRanges) {
			delimiterIndex = line.indexOf('-');
			assert.notEqual(delimiterIndex, -1, 'line does not contain delimiter');
			start = getIntegerInString(line, 0, delimiterIndex);
			end = getIntegerInString(line, delimiterIndex + 1);

			ranges.push({start, end});
		} else if (!readingRanges && version === 1) {
			id = getIntegerInString(line);
			for (const range of ranges) {
				if (id >= range.start && id <= range.end) {
					count++;
					break;
				}
			}
		}
	}

	if (version === 2) {
		ranges.sort((a, b) => a.start - b.start);
		const merged = [ranges[0]!];

		for (const current of ranges) {
			const last = merged.at(-1)!;
			if (last && current.start <= last.end + 1) {
				last.end = Math.max(last.end, current.end);
			} else {
				merged.push(current);
			}
		}

		for (const range of merged) {
			count += range.end - range.start + 1;
		}
	}

	return count;
}

const input = path.join(import.meta.dirname, 'input.txt');
const example = path.join(import.meta.dirname, 'example.txt');

const data = {
	example_one: await process(example, 1),
	one: await process(input, 1),
	example_two: await process(example, 2),
	two: await process(input, 2),
};

console.log(data);
assert.equal(data.example_one, 3, 'Example one');
assert.equal(data.example_two, 14, 'Example two');
