function getBitsPerElement(dictionaryLength) {
	return Math.ceil(Math.log2(dictionaryLength));
}

function putNumberInBytes(bitCount, bitPos, n, bytes) {

	let bitsLeft = bitCount;
	let bytePos = Math.floor(bitPos / 8);

	// 1. Write to the remaining bits left in the byte
	let bitsUsedInByte = bitPos % 8;
	let bitsLeftInByte = 8 - bitsUsedInByte;
	bytes[bytePos] |= n << bitsUsedInByte; /* will get the correct number of bits needed
		 to fill byte and the rest will be cut off cause Uint8Array */
	n >>= bitsLeftInByte;
	bitsLeft -= bitsLeftInByte;
	bytePos++;

	// 2. Write all full bytes
	while (bitsLeft >= 8) {
		bytes[bytePos] = n & 0xFF;
		n >>= 8;
		bitsLeft -= 8;
		bytePos++;
	}

	// 3. Write leftover bytes to lower bits of last byte
	bytes[bytePos] |= n;
}

export {
	getBitsPerElement,
	putNumberInBytes
};
