const assert = require('assert');

const comp = require('../src/compress');
const resizeIfNecessary = comp.resizeIfNecessary;
const compress = comp.compress;
const writeBytes = comp.writeBytes;
const decompress = comp.decompress;

const initDictionary = require('../src/dict').initDictionary;

describe('Compression & Decompression', () => {
	describe('resizeIfNecessary()', () => {
		it('no resize', () => {
			assert.deepEqual(resizeIfNecessary(0, 0, new Uint8Array([])), new Uint8Array([]));
			assert.deepEqual(resizeIfNecessary(0, 6, new Uint8Array([1, 2, 3])), new Uint8Array([1, 2, 3]));
			assert.deepEqual(resizeIfNecessary(12, 11, new Uint8Array([1, 2, 3])), new Uint8Array([1, 2, 3]));
			assert.deepEqual(resizeIfNecessary(0, 3, new Uint8Array([32, 45, 210, 61, 99])), new Uint8Array([32, 45, 210, 61, 99]));
			assert.deepEqual(resizeIfNecessary(66, 13, new Uint8Array([97, 16, 13, 16, 135, 121, 166, 110, 107, 3])), new Uint8Array([97, 16, 13, 16, 135, 121, 166, 110, 107, 3]));
		});
		it('yes resize', () => {
			assert.deepEqual(resizeIfNecessary(12, 12, new Uint8Array([1, 2, 3])), new Uint8Array([1, 2, 3, 0, 0, 0]));
			assert.deepEqual(resizeIfNecessary(38, 9, new Uint8Array([32, 45, 210, 61, 99])), new Uint8Array([32, 45, 210, 61, 99, 0, 0, 0, 0, 0]));
			assert.deepEqual(resizeIfNecessary(66, 14, new Uint8Array([97, 16, 13, 16, 135, 121, 166, 110, 107, 3])), new Uint8Array([97, 16, 13, 16, 135, 121, 166, 110, 107, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
		});
	});
	describe('compress()', () => {
		it('basic', () => {
			assert.deepEqual(compress(initDictionary(), new Uint8Array([1, 4, 4, 4])), new Uint8Array([1, 4, 2, 2]));
			assert.deepEqual(compress(initDictionary(), new Uint8Array([1, 2, 3, 3, 3, 2, 3, 2, 3])), new Uint8Array([1, 2, 6, 8, 12, 24, 16]));
			assert.deepEqual(compress(initDictionary(), new Uint8Array([78, 16, 109, 126, 0])), new Uint8Array([78, 16, 218, 248, 1, 0]));
			assert.deepEqual(compress(initDictionary(), new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])), new Uint8Array([1, 2, 6, 16, 40, 96, 224, 0, 2]));
		});
		it('empty data', () => {
			assert.deepEqual(compress(initDictionary(), new Uint8Array([])), new Uint8Array([]));
		});
		it('cumulative dictionary', () => {
			let dict = initDictionary();
			assert.deepEqual(compress(dict, new Uint8Array([7, 255, 9, 22, 64])), new Uint8Array([7, 255, 18, 88, 0, 2]));
			assert.deepEqual(compress(dict, new Uint8Array([0, 8, 64, 17, 244, 32, 156, 22, 222])), new Uint8Array([0, 16, 0, 137, 64, 15, 4, 39, 11, 222, 0]));
			assert.deepEqual(compress(dict, new Uint8Array([1, 2, 3, 4])), new Uint8Array([1, 4, 12, 32, 0]));
			assert.deepEqual(compress(dict, new Uint8Array([5, 4, 5, 4, 3, 4, 3, 4, 1])), new Uint8Array([5, 8, 60, 116, 232, 48, 0]));
		});
	});
	describe('writeBytes()', () => {
		it ('no values', () => {
			let bytes = new Uint8Array(6);
			assert.deepEqual(writeBytes([], 0, bytes), new Uint8Array(6));
		});
		it('basic', () => {
			let bytes = new Uint8Array([1, 2, 0, 0, 0, 0]);
			assert.deepEqual(writeBytes([3, 4, 5, 6], 2, bytes), new Uint8Array([1, 2, 3, 4, 5, 6]));

			bytes = new Uint8Array([0, 0, 0, 0]);
			assert.deepEqual(writeBytes([73, 12, 44], 0, bytes), new Uint8Array([73, 12, 44, 0]));

			bytes = new Uint8Array([1, 2]);
			assert.deepEqual(writeBytes([3], 1, bytes), new Uint8Array([1, 3]));
		});
		it('resize', () => {
			let bytes = new Uint8Array([1, 2, 3, 0, 0]);
			assert.deepEqual(writeBytes([1, 3, 4], 3, bytes), new Uint8Array([1, 2, 3, 1, 3, 4, 0, 0, 0, 0]));
			
			bytes = new Uint8Array([0, 0, 0]);
			assert.deepEqual(writeBytes([96, 33, 17, 146], 0, bytes), new Uint8Array([96, 33, 17, 146, 0, 0]));
		});
	});
	describe('decompress()', () => {
		it('basic', () => {
			let uncompressedDataArrays = [
				new Uint8Array([1, 2, 1, 2]),
				new Uint8Array([0, 1, 2]),
				new Uint8Array([78, 61, 249, 163, 88, 88, 163, 88, 88, 163, 88]),
				new Uint8Array([79, 79, 79, 79, 79, 79]),
				new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
			];

			for (let data of uncompressedDataArrays) {
				let compressedData = compress(initDictionary(), data);
				let uncompressedData = decompress(initDictionary(), compressedData);
				assert.deepEqual(uncompressedData, data);
			}
		});
		it('empty data', () => {
			assert.deepEqual(decompress(initDictionary(), new Uint8Array([])), new Uint8Array([]));
		});
		it('cumulative dictionary', () => {
			let uncompressedDataArrays = [
				new Uint8Array([1, 2, 1, 2]),
				new Uint8Array([0, 1, 2]),
				new Uint8Array([78, 61, 249, 163, 88, 88, 163, 88, 88, 163, 88]),
				new Uint8Array([79, 79, 79, 79, 79, 79]),
				new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
			];

			let compressionDict = initDictionary();
			let decompressionDict = initDictionary();

			for (let data of uncompressedDataArrays) {
				let compressedData = compress(compressionDict, data);
				let uncompressedData = decompress(decompressionDict, compressedData);
				assert.deepEqual(uncompressedData, data);
			}
		});
	});
});
