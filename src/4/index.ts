/** biome-ignore-all lint/style/noNonNullAssertion: We need to assert our index acess */
import assert from 'node:assert';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createInterface as readline} from 'node:readline';
import {type} from 'arktype';

const GridTypeSchema = type("'@' | '.' | 'x'");

type GridType = typeof GridTypeSchema.infer;

async function process(
	inputFile: string,
	maxIterations = 1_000_000,
	shouldLog = false,
) {
	const rl = readline(createReadStream(inputFile));
	const grid: Array<Array<GridType>> = [];

	let rowCount = 0;
	for await (const line of rl) {
		grid[rowCount] = [];
		for (let i = 0; i < line.length; ++i) {
			grid[rowCount]![i] = GridTypeSchema.assert(line[i]);
		}

		rowCount++;
	}

	let iterations = 0;
	let active = true;
	let sum = 0;
	let current = 0;
	while (iterations < maxIterations && active) {
		current = 0;
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y]!.length; x++) {
				let count = 0;
				if (grid[y]![x] === '.') continue;

				for (let xOffset = -1; xOffset < 2; xOffset++) {
					for (let yOffset = -1; yOffset < 2; yOffset++) {
						if (yOffset === 0 && xOffset === 0) {
							continue;
						}

						const char = grid[y + yOffset]?.[x + xOffset];
						if (char === '@' || char === 'x') {
							count++;
						}
					}
				}

				if (count < 4) {
					grid[y]![x] = 'x';
					current++;
				}
			}
		}

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y]!.length; x++) {
				if (grid[y]?.[x] === 'x') {
					grid[y]![x] = '.';
				}
			}
		}

		active = current > 0;
		sum += current;
		shouldLog && console.log({current, active, sum, iterations});
		iterations++;
	}

	return sum;
}

const input = path.join(import.meta.dirname, 'input.txt');
const example = path.join(import.meta.dirname, 'example.txt');

const data = {
	example_one: await process(example, 1),
	one: await process(input, 1),
	example_two: await process(example, 10, true),
	two: await process(input),
};

console.log(data);
assert.equal(data.example_one, 13, 'Example one');
assert.equal(data.example_two, 43, 'Example two');
