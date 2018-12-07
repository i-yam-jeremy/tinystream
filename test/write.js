const assert = require('assert');

const WriteStream = require('../src/write').WriteStream;
const compress = require('../src/compress').compress;
const initDictionary = require('../src/dict').initDictionary;

describe('WriteStream', () => {
	describe('no callback', () => {
		it('no callback', () => {
			let output = new WriteStream();
			output.write(new Uint8Array(0));
		});
	});
	describe('#write()', () => {
		it('basic', (done) => {
			let uncompressedData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
			let output = new WriteStream(data => {
				assert.deepEqual(data, compress(initDictionary(), uncompressedData));	
				done();
			});
			output.write(uncompressedData);
		});
		it('empty data', (done) => {
			let uncompressedData = new Uint8Array([]);
			let output = new WriteStream(data => {
				assert.deepEqual(data, compress(initDictionary(), uncompressedData));	
				done();
			});
			output.write(uncompressedData);
		});
		it('cumulative dictionary', (done) => {
			let uncompressedDataArrays = [
				new Uint8Array([93, 47, 207, 63, 178]),
				new Uint8Array([55, 9, 31, 73, 190, 142, 78, 11])
			];
			let dictionary = initDictionary();
			let writeCount = 0;
			let output = new WriteStream(data => {
				assert.deepEqual(data, compress(dictionary, uncompressedDataArrays[writeCount]));	
				writeCount++;
				
				if (writeCount == 2) {
					done();
				}
			});
			output.write(uncompressedDataArrays[0]);
			output.write(uncompressedDataArrays[1]);
		});
	});
});
