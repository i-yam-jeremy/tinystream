const dict = require('./dict');
const isInDictionary = dict.isInDictionary;
const dictIndexOf = dict.dictIndexOf;

const bits = require('./bits');
const getBitsPerElement = bits.getBitsPerElement;
const putNumberInBytes = bits.putNumberInBytes;
const readNumberFromBytes = bits.readNumberFromBytes;

function writeElement(outputBitPos, outputBytes, dictionary, s) {
	let elementBitCount = getBitsPerElement(dictionary.length);
	let n = dictIndexOf(dictionary, s);

	if ((outputBitPos + elementBitCount)/8 >= outputBytes.length) {
		newOutputBytes = new Uint8Array(2*outputBytes.length);
		newOutputBytes.set(outputBytes, 0);
		outputBytes = newOutputBytes;
	}

	putNumberInBytes(elementBitCount, outputBitPos, n, outputBytes);

	return outputBytes;
}

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
			outputBytes = writeElement(outputBitPos, outputBytes, dictionary, s);
			outputBitPos += getBitsPerElement(dictionary.length);
			dictionary.push(s.concat([c]));
			s = [c];
		}
	}
	outputBytes = writeElement(outputBitPos, outputBytes, dictionary, s);
	outputBitPos += getBitsPerElement(dictionary.length);
	
	return outputBytes.slice(0, Math.ceil((outputBitPos+1)/8));
}

function writeBytes(values, bytePos, dstBytes) {
	if (values.length + bytePos >= dstBytes.length) {
		let newBytes = new Uint8Array(2*dstBytes.length);
		newBytes.set(dstBytes, 0);
		dstBytes = newBytes;
	}

	dstBytes.set(values, bytePos);

	return dstBytes;
}

function decompress(dictionary, data) {
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

module.exports = {compress, decompress};
