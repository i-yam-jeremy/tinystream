const assert = require('assert');

const comp = require('../src/compress');
const writeElement = comp.writeElement;
const compress = comp.compress;
const writeBytes = comp.writeBytes;
const decompress = comp.decompress;

describe('Compression & Decompression', () => {
	describe('writeElement()', () => {
		//TODO
	});
	describe('compress()', () => {
		//TODO
	});
	describe('writeBytes()', () => {
		it ('no values', () => {
			let bytes = new Uint8Array(6);
			assert.deepEqual(writeBytes([], 0, bytes), new Uint8Array(6));
		});
		it('basic', () => {
			let bytes = new Uint8Array([1, 2, 0, 0, 0, 0]);
			assert.deepEqual(writeBytes([3, 4, 5, 6], 2, bytes), new Uint8Array([1, 2, 3, 4, 5, 6]));
		});
		it('resize', () => {
			let bytes = new Uint8Array([1, 2, 3, 0, 0]);
			assert.deepEqual(writeBytes([1, 3, 4], 3, bytes), new Uint8Array([1, 2, 3, 1, 3, 4, 0, 0, 0, 0]));
			
			bytes = new Uint8Array([0, 0, 0]);
			assert.deepEqual(writeBytes([96, 33, 17, 146], 0, bytes), new Uint8Array([96, 33, 17, 146, 0, 0]));
		});
	});
	describe('decompress()', () => {
		//TODO
	});
});
