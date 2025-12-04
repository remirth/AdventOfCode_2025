import * as $ from "bun:test";
import { chunkString } from "./chunk";

$.describe("chunkString", () => {
	$.it("should chunk a string", () => {
		let i = 0;
		for (const chunk of chunkString("foobar", 3)) {
			$.expect(chunk.length, "Chunk length to be 3").toBe(3);

			switch (i) {
				case 0: {
					$.expect(chunk).toBe("foo");
					break;
				}
				case 1: {
					$.expect(chunk).toBe("bar");
					break;
				}
			}

			i++;
		}
	});
});
