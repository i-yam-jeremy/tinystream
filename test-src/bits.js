const assert = require('assert');
import {getBitsPerElement, putNumberInBytes, nLongBitMask, readNumberFromBytes} from '../src/bits';


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
	describe('nLongBitMask()', () => {
		it('0 bits long', () => {
			assert.equal(nLongBitMask(0), 0);
		});
		it('rest of the cases up to 30 bits', () => {
			assert.equal(nLongBitMask( 1), 0x1);
			assert.equal(nLongBitMask( 2), 0x3);
			assert.equal(nLongBitMask( 3), 0x7);
			assert.equal(nLongBitMask( 4), 0xF);
			assert.equal(nLongBitMask( 5), 0x1F);
			assert.equal(nLongBitMask( 6), 0x3F);
			assert.equal(nLongBitMask( 7), 0x7F);
			assert.equal(nLongBitMask( 8), 0xFF);
			assert.equal(nLongBitMask( 9), 0x1FF);
			assert.equal(nLongBitMask(10), 0x3FF);
			assert.equal(nLongBitMask(11), 0x7FF);
			assert.equal(nLongBitMask(12), 0xFFF);
			assert.equal(nLongBitMask(13), 0x1FFF);
			assert.equal(nLongBitMask(14), 0x3FFF);
			assert.equal(nLongBitMask(15), 0x7FFF);
			assert.equal(nLongBitMask(16), 0xFFFF);
			assert.equal(nLongBitMask(17), 0x1FFFF);
			assert.equal(nLongBitMask(18), 0x3FFFF);
			assert.equal(nLongBitMask(19), 0x7FFFF);
			assert.equal(nLongBitMask(20), 0xFFFFF);
			assert.equal(nLongBitMask(21), 0x1FFFFF);
			assert.equal(nLongBitMask(22), 0x3FFFFF);
			assert.equal(nLongBitMask(23), 0x7FFFFF);
			assert.equal(nLongBitMask(24), 0xFFFFFF);
			assert.equal(nLongBitMask(25), 0x1FFFFFF);
			assert.equal(nLongBitMask(26), 0x3FFFFFF);
			assert.equal(nLongBitMask(27), 0x7FFFFFF);
			assert.equal(nLongBitMask(28), 0xFFFFFFF);
			assert.equal(nLongBitMask(29), 0x1FFFFFFF);
			assert.equal(nLongBitMask(30), 0x3FFFFFFF);
		});
	});
	describe('readNumberFromBytes()', () => {
		it('test', () => {
			let bytes = new Uint8Array([41, 141, 0, 24, 255]);
			assert.equal(readNumberFromBytes(8, 1, bytes), (41>>1)|128);
			assert.equal(readNumberFromBytes(9, 0, bytes), 297);
			assert.equal(readNumberFromBytes(9, 3, bytes), (41>>3) | ((141 & 0x1F) << 5));
		});
	});
});
