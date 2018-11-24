const assert = require('assert');
import {getBitsPerElement, putNumberInBytes, numbersToBytes, lzwElementsToBytes} from '../src/bits';


describe('LZW Elements To Bytes', () => {
	describe('getBitsPerElement()', () => {
		it('starting singleton dictionary', () => {
			assert.equal(getBitsPerElement(256), 8);
		});
	});
});
