const assert = require('assert');
import {getBitsPerElement, putNumberInBytes, numbersToBytes, lzwElementsToBytes} from '../src/bits';


describe('LZW Elements To Bytes', () => {
	describe('getBitsPerElement()', () => {
		it('starting singleton dictionary', () => {
			assert.equal(getBitsPerElement(256), 8);
		});
		it('larger sizes', () => {
			assert.equal(getBitsPerElement(257), 9);
			assert.equal(getBitsPerElement(381), 9);
			assert.equal(getBitsPerElement(511), 9);
			assert.equal(getBitsPerElement(512), 9);
			assert.equal(getBitsPerElement(513), 10);
			assert.equal(getBitsPerElement(1035), 11);
			assert.equal(getBitsPerElement(8081), 13);
			assert.equal(getBitsPerElement(100985), 17);
			assert.equal(getBitsPerElement(12646297897), 34);
		});
	});
	describe('putNumberInBytes()', () => {
		it('numbers smaller than 2 bytes', () => { // FIXME rename test as even 10 bits can be spread across 3 bytes
			let bytes = new Uint8Array(6);
			let bitPos = 0;

			putNumberInBytes(9, bitPos, 385, bytes);
			bitPos += 9;
			assert.deepEqual(bytes, new Uint8Array([129, 1, 0, 0, 0, 0]));

			putNumberInBytes(12, bitPos, 93, bytes);
			bitPos += 12;
			assert.deepEqual(bytes, new Uint8Array([129, 187, 0, 0, 0, 0]));

			//TODO add more tests and divide into categories
		});	
	});
});
