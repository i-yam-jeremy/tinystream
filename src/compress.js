const dict = require('./dict');
const isInDictionary = dict.isInDictionary;
const dictIndexOf = dict.dictIndexOf;

const bits = require('./bits');
const getBitsPerElement = bits.getBitsPerElement;
const putNumberInBytes = bits.putNumberInBytes;
const readNumberFromBytes = bits.readNumberFromBytes;

/*
	Resizes the given byte array if writing a value of the specified
		bit size at the specified position would cause it to overflow

	@param outputBitPos - integer - the position where you are planning on writing
	@param elementBitCount - integer - the size of the element you are planning on writing
	@param outputBytes - integer - the byte array

	@return - Uint8Array - a byte array containing the same data as the given byte array but
		 padded with zeros at the end if necessary
*/
function resizeIfNecessary(outputBitPos, elementBitCount, outputBytes) {
	if ((outputBitPos + elementBitCount)/8 >= outputBytes.length) {
		newOutputBytes = new Uint8Array(2*outputBytes.length);
		newOutputBytes.set(outputBytes, 0);
		return newOutputBytes;
	}
	else {
		return outputBytes;
	}
}

/*
	Compresses data with LZW using the given dictionary

	@see src/dict.js

	@param dictionary - Dictionary - the dictionary to use (this is modified)
	@param data - Uint8Array - the data to compress

	@return - Uint8Array - the compressed data
*/
function compress(dictionary, data) {
	let outputBytes = new Uint8Array(data.length);
	let outputBitPos = 0;

	let s = [];
	for (let i = 0; i < data.length; i++) {
		let c = data[i];
		if (isInDictionary(dictionary, s.concat([c]))) {
			s.push(c);
		}
		else {
			let elementBitCount = getBitsPerElement(dictionary.length);
			let n = dictIndexOf(dictionary, s);
			outputBytes = resizeIfNecessary(outputBitPos, elementBitCount, outputBytes);
			putNumberInBytes(elementBitCount, outputBitPos, n, outputBytes);
			outputBitPos += elementBitCount; 
			dictionary.push(s.concat([c]));
			s = [c];
		}
	}
	let elementBitCount = getBitsPerElement(dictionary.length);
	let n = dictIndexOf(dictionary, s);
	outputBytes = resizeIfNecessary(outputBitPos, elementBitCount, outputBytes);
	putNumberInBytes(elementBitCount, outputBitPos, n, outputBytes);
	outputBitPos += elementBitCount;
	
	return outputBytes.slice(0, Math.ceil((outputBitPos+1)/8));
}

/*
	Writes the given values to the byte array at the specified
		position, resizing the destination array if necessary

	@param values - byte[] - an array of integers between 0 and 255 inclusive
	@param bytePos - integer - the position to write the values
	@param dstBytes - Uint8Array - the destination for where to write the values

	@return - Uint8Array - a byte array containing the same data as dstBytes, but
		with values written at bytePos and padded with zeros if necessary to
		prevent overflow
*/
function writeBytes(values, bytePos, dstBytes) {
	if (values.length + bytePos > dstBytes.length) {
		let newBytes = new Uint8Array(2*dstBytes.length);
		newBytes.set(dstBytes, 0);
		dstBytes = newBytes;
	}

	dstBytes.set(values, bytePos);

	return dstBytes;
}

/*
	Deompresses data with LZW using the given dictionary

	@see src/dict.js

	@param dictionary - Dictionary - the dictionary to use (this is modified)
	@param data - Uint8Array - the data to decompress

	@return - Uint8Array - the decompressed data
*/
function decompress(dictionary, data) {
	if (data.length == 0) {
		return new Uint8Array([]);
	}

	let outputBytes = new Uint8Array(data.length);
	let outputBytePos = 0;
	let bitPos = 0;
	let oldIndex = readNumberFromBytes(getBitsPerElement(dictionary.length), bitPos, data);
	bitPos += getBitsPerElement(dictionary.length);
	
	outputBytes = writeBytes(dictionary[oldIndex], outputBytePos, outputBytes);
	outputBytePos += dictionary[oldIndex].length;
	
	while (bitPos < 8*data.length - getBitsPerElement(dictionary.length+1)) {
		let newIndex = readNumberFromBytes(getBitsPerElement(dictionary.length+1), bitPos, data);
		bitPos += getBitsPerElement(dictionary.length+1);
		

		if (newIndex < dictionary.length) {
			let s = dictionary[newIndex];
			
			outputBytes = writeBytes(s, outputBytePos, outputBytes);
			outputBytePos += s.length;

			let c = s[0];
			dictionary.push(dictionary[oldIndex].concat([c]));
		}
		else {
			let c = dictionary[oldIndex][0];
			let s = dictionary[oldIndex].concat([c]);

			dictionary.push(s);
			
			outputBytes = writeBytes(s, outputBytePos, outputBytes);
			outputBytePos += s.length;
		}
			
		oldIndex = newIndex;
	}

	return outputBytes.slice(0, outputBytePos);
}

module.exports = {resizeIfNecessary, compress, writeBytes, decompress};
