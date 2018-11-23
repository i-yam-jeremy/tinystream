//TODO replace with smaller methods that just convert bits to bytes and then make another method for lzw elements to bytes
function lzwElementsToBytes(dictionarySize, elements) {
	let elementBitSize = Math.ceil(Math.log2(dictionarySize));
	let totalBitCount = elementBitSize * elements.length;
	let byteCount = Math.ceil(totalBitCount / 8);

	let bytes = new Uint8Array(byteCount);
	
	let bitPos = 0;
	for (let element of elements) {
		let bytePos = Math.floor(bitPos / 8);
		let bitsUsedInByte = bitPos % 8;
		let bitsLeftInByte = 8 - bitsUsedInByte;
		let lowerMask = (1 << (bitsLeftInByte+1)) - 1; // all 1s (the count of 1s is bitsLeftInByte)
		bytes[bytePos] |= (element & lowerMask) << bitsUsedInByte;
		bytes[bytePos+1] |= element >> bitsLeftInByte;

		bitPos += elementBitSize;
	}

	return bytes;
}

export {lzwElementsToBytes};
