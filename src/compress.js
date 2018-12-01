import {isInDictionary, dictIndexOf} from './dict';
import {getBitsPerElement, putNumberInBytes, readNumberFromBytes} from './bits';

function writeElement(outputBitPos, outputBytes, dictionary, s) {
	let elementBitCount = getBitsPerElement(dictionary.length);
	let n = dictIndexOf(dictionary, s);

	if ((outputBitPos + elementBitCount)/8 > outputBytes.length) {
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

	return outputBytes.slice(0, Math.ceil(outputBitPos/8));
}

function decompress(dictionary, data) {
	let outputBytes = new Uint8Array(data.length);
	let bitPos = 0;
	let oldIndex = readNumberFromBytes(getBitsPerElement(dictionary.length), bitPos, data);
	bitPos += getBitsPerElement(dictionary.length);
	//TODO output old code translation
	console.log(dictionary[oldIndex]);
	while (bitPos/8 < data.length) {
		let newIndex = readNumberFromBytes(getBitsPerElement(dictionary.length), bitPos, data);
		bitPos += getBitsPerElement(dictionary.length);
		console.log(bitPos);
		let s = dictionary[newIndex];
		console.log(s);
		//TODO output the bytes in s
		let c = s[0];
		dictionary.push(dictionary[oldIndex].concat([c]));
		oldIndex = newIndex;
	}

	return outputBytes;
}

export {compress, decompress};
