function getBitsPerElement(dictionaryLength) {
	return Math.ceil(Math.log2(dictionaryLength));
}

function putNumberInBytes(bitCount, bitPos, n, bytes) {

	let bitsLeft = bitCount;
	let bytePos = Math.floor(bitPos / 8);

	// 1. Write to the remaining bits left in the byte
	let bitsUsedInByte = bitPos % 8;
	let bitsLeftInByte = 8 - bitsUsedInByte;

	bytes[bytePos] &= ~(nLongBitMask(Math.min(bitsLeftInByte, bitCount)) << bitsUsedInByte); // clear bits to be written
	bytes[bytePos] |= n << bitsUsedInByte; /* will get the correct number of bits needed
		 to fill byte and the rest will be cut off cause Uint8Array */
	n >>= bitsLeftInByte;
	bitsLeft -= bitsLeftInByte;
	bytePos++;

	// 2. Write all full bytes
	while (bitsLeft >= 8) {
		bytes[bytePos] = 0;
		bytes[bytePos] = n & 0xFF;
		n >>= 8;
		bitsLeft -= 8;
		bytePos++;
	}

	// 3. Write leftover bits to lower bits of last byte
	bytes[bytePos] &= ~nLongBitMask(bitsLeft);
	bytes[bytePos] |= n;
}

function nLongBitMask(n) { // generates 1 bits (n of them)
	if (n <= 0) {
		return 0x0;
	}
	else {
		return (1 << n) - 1;
	}
}

function readNumberFromBytes(bitCount, bitPos, bytes) {
	let n = 0;

	let bitsLeft = bitCount;
	let bitsUsed = 0;
	let bytePos = Math.floor(bitPos / 8);

	// 1. Read from the remaining bits left in the byte
	let bitsUsedInByte = bitPos % 8;
	let bitsLeftInByte = 8 - bitsUsedInByte;
	n |= bytes[bytePos] >> bitsUsedInByte;
	bitsLeft -= bitsLeftInByte;
	bitsUsed += bitsLeftInByte;
	bytePos++;


	// 2. Write all full bytes
	while (bitsLeft >= 8) {
		n |= bytes[bytePos] << bitsUsed;
		bitsLeft -= 8;
		bitsUsed += 8;
		bytePos++;
	}

	let prevN = n;
	// 3. Read leftover bits from lower bits of last byte
	n |= (bytes[bytePos] & nLongBitMask(bitsLeft)) << bitsUsed;


	return n;
}

module.exports = {
	getBitsPerElement,
	putNumberInBytes,
	nLongBitMask,
	readNumberFromBytes
};
