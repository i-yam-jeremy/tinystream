const assert = require('assert');

const ReadStream = require('../src/read').ReadStream;
const compress = require('../src/compress').compress;
const initDictionary = require('../src/dict').initDictionary;

describe('ReadStream', () => {
	describe('no callback', () => {
		it('no callback', () => {
			let input = new ReadStream();
			input.onData(new Uint8Array(0));	
		});
	});
	describe('#onData()', () => {
		it('basic', (done) => {
			let uncompressedData = new Uint8Array([83, 70, 0, 15, 150, 180, 245, 16, 200, 56, 13]);

			let input = new ReadStream(data => {
				assert.deepEqual(data, uncompressedData);
				done();
			});

			let dictionary = initDictionary();
			let compressedData = compress(dictionary, uncompressedData);
			input.onData(compressedData);
		});
		it('empty data', (done) => {
			let uncompressedData = new Uint8Array([]);

			let input = new ReadStream(data => {
				assert.deepEqual(data, uncompressedData);
				done();
			});

			let dictionary = initDictionary();
			let compressedData = compress(dictionary, uncompressedData);
			input.onData(compressedData);
		});
		it('cumulative dictionary', (done) => {
			let uncompressedDataArrays = [
				new Uint8Array([89, 0, 0, 0, 135]),
				new Uint8Array([3, 2, 0, 255])
			];
			let readCount = 0;

			let input = new ReadStream(data => {
				assert.deepEqual(data, uncompressedDataArrays[readCount]);
				readCount++;

				if (readCount == 2) {
					done();
				}
			});

			let dictionary = initDictionary();
			input.onData(compress(dictionary, uncompressedDataArrays[0]));
			input.onData(compress(dictionary, uncompressedDataArrays[1]));
		});
	});
});
