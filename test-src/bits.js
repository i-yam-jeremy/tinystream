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
	describe('numbersToBytes()', () => {
		it('empty list', () => {
			let emptyBytes = new Uint8Array(0);
			assert.deepEqual(numbersToBytes(0, []), emptyBytes);
			assert.deepEqual(numbersToBytes(3, []), emptyBytes);
			assert.deepEqual(numbersToBytes(14, []), emptyBytes);
			assert.deepEqual(numbersToBytes(45, []), emptyBytes);
		});
		it('12-bit numbers', () => {
			let numbers = [1, 5, 299, 209, 511, 63, 344];
			let bytes = new Uint8Array(11);
			putNumberInBytes(12,  0, numbers[0], bytes);
			putNumberInBytes(12, 12, numbers[1], bytes);
			putNumberInBytes(12, 24, numbers[2], bytes);
			putNumberInBytes(12, 36, numbers[3], bytes);
			putNumberInBytes(12, 48, numbers[4], bytes);
			putNumberInBytes(12, 60, numbers[5], bytes);
			putNumberInBytes(12, 72, numbers[6], bytes);

			assert.deepEqual(numbersToBytes(12, numbers), bytes);
		});
		it('18-bit numbers', () => {
			let numbers = [703, 1444, 9, 70000, 9999, 262143, 808, 450, 1, 0];
			let bytes = new Uint8Array(Math.ceil(numbers.length*18/8));
			putNumberInBytes(18,  0, numbers[0], bytes);
			putNumberInBytes(18, 18, numbers[1], bytes);
			putNumberInBytes(18, 36, numbers[2], bytes);
			putNumberInBytes(18, 54, numbers[3], bytes);
			putNumberInBytes(18, 72, numbers[4], bytes);
			putNumberInBytes(18, 90, numbers[5], bytes);
			putNumberInBytes(18, 108, numbers[6], bytes);
			putNumberInBytes(18, 126, numbers[7], bytes);
			putNumberInBytes(18, 144, numbers[8], bytes);
			putNumberInBytes(18, 162, numbers[9], bytes);

			assert.deepEqual(numbersToBytes(18, numbers), bytes);
		});
	});
});
