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

function numbersToBytes(bitCountPerNum, numbers) {
	let totalBitCount = bitCountPerNum * numbers.length;
	let byteCount = Math.ceil(totalBitCount / 8);

	let bytes = new Uint8Array(byteCount);
	
	let bitPos = 0;
	for (let n of numbers) {
		putNumberInBytes(bitCountPerNum, bitPos, n, bytes);
		bitPos += bitCountPerNum;
	}

	return bytes;
}

function lzwElementsToBytes(dictionaryLength, elements) {
	let elementBitSize = getBitsPerElement(dictionaryLength); 
	return numbersToBytes(elementBitSize, elements);
}

export {
	getBitsPerElement,
	putNumberInBytes,	
	numbersToBytes,
	lzwElementsToBytes
};
