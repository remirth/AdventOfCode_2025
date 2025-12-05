import * as $ from 'bun:test';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {SplitStream} from './streams';

$.describe('SplitStream', () => {
	const SAMPLE_FILE = path.join(import.meta.dirname, 'splitStreamTest.txt');
	const SAMPLE_RESULT = [
		'11-22',
		'95-115',
		'998-1012',
		'1188511880-1188511890',
		'222220-222224',
		'1698522-1698528',
		'446443-446449',
		'38593856-38593862',
		'565653-565659',
		'824824821-824824827',
		'2121212118-2121212124',
	];
	$.it('Transform a stream split by a delimiter', async () => {
		const rs = createReadStream(SAMPLE_FILE).pipe(new SplitStream(','));
		const result: Array<string> = [];

		for await (const v of rs) {
			result.push(v);
		}

		$.expect(result).toMatchObject(SAMPLE_RESULT);
	});
});
