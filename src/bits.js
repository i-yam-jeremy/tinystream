/*
	Returns the number of bits needed to store an element
		based on the given dictionary length

	@param dictionaryLength - integer - the size of the dictionary

	@return - integer - the number of bits needed
*/
function getBitsPerElement(dictionaryLength) {
	return Math.ceil(Math.log2(dictionaryLength));
}

/*
	Inserts the given value into the byte array at the specified position
	Note: this function modifies the given byte array

	@param bitCount - integer - the number of bits to write
	@param bitPos - integer - the position (in bits) to write the number
	@param n - integer - the number to write
	@param bytes - Uint8Array - the destination to write the number to
*/
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

/*
	Creates a bit mask consisting of the specified number of 1s
		(returns 0 if n <= 0)

	@param n - integer - the number of 1 bits in the bitmask	

	@return - integer - the bit mask
*/
function nLongBitMask(n) {
	if (n <= 0) {
		return 0x0;
	}
	else {
		return (1 << n) - 1;
	}
}

/*
	Reads a number from a byte array at the specified position

	@param bitCount - integer - the number of bits to read
	@param bitPos - integer - the position in bits at which to read
	@param bytes - Uint8Array - the bytes to read from

	@return - integer - the number that was read
*/
function readNumberFromBytes(bitCount, bitPos, bytes) {
	let n = 0;

	let bitsLeft = bitCount;
	let bitsUsed = 0;
	let bytePos = Math.floor(bitPos / 8);

	// 1. Read from the remaining bits left in the byte
	let bitsUsedInByte = bitPos % 8;
	let bitsLeftInByte = 8 - bitsUsedInByte;
	n |= (bytes[bytePos] >> bitsUsedInByte) & nLongBitMask(bitCount); // get the bits and trim off the necessary top bits if bitCount < bitsLeftInByte
	bitsLeft -= bitsLeftInByte;
	bitsUsed += bitsLeftInByte;
	bytePos++;


	// 2. Read all full bytes
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
