function getBitsPerElement(dictionaryLength) {
	return Math.ceil(Math.log2(dictionaryLength));
}

/*
	Works for 8 < bitCount < 16
	TODO make this work for numbers larger than 16-bits
*/
function putNumberInBytes(bitCount, bitPos, n, bytes) {
	let bytePos = Math.floor(bitPos / 8);
	let bitsUsedInByte = bitPos % 8;
	let bitsLeftInByte = 8 - bitsUsedInByte;
	let lowerMask = (1 << (bitsLeftInByte+1)) - 1; // all 1s (the count of 1s is bitsLeftInByte)
	bytes[bytePos] |= (n & lowerMask) << bitsUsedInByte;
	bytes[bytePos+1] |= n >> bitsLeftInByte;
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
