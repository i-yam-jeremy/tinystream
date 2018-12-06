const assert = require('assert');

const TinyWriteStream = require('../src/write').TinyWriteStream;
const TinyReadStream = require('../src/read').TinyReadStream;

describe('TinyWriteStream', () => {
	describe('#write()', () => {
		it('should be true, dummy test', () => {
			assert.equal(1, 1);

			/*let tinyread = new TinyReadStream(data => {
				console.log(data);
			});
			let out = new TinyWriteStream(data => {
				console.log(data);
				tinyread.onData(data);
			});
			out.write(new Uint8Array([1, 2, 3, 3, 3, 1, 2, 1, 2, 1, 2, 1, 2]));*/
		});
	});
});
