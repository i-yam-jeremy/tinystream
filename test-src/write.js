const assert = require('assert');
import {TinyWriteStream} from '../src/write';
import {TinyReadStream} from '../src/read';

describe('TinyWriteStream', () => {
	describe('#write()', () => {
		it('should be true, dummy test', () => {
			assert.equal(1, 1);

			let tinyread = new TinyReadStream(data => {
				console.log(data);
			});
			let out = new TinyWriteStream(data => {
				tinyread.onData(data);
			});
			out.write(new Uint8Array([1, 2, 3, 3, 3, 1, 2, 1, 2, 1, 2]));

		});
	});
});
