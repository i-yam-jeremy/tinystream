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

	console.log("n", n);

	putNumberInBytes(elementBitCount, outputBitPos, n, outputBytes);

	return outputBytes;
}

function compress(dictionary, data) {
	let outputBytes = new Uint8Array(data.length);
	let outputBitPos = 0;

	let c = data[0];
	outputBytes[0] = c;
	outputBitPos += 8;
	console.log("First Byte", c);
	let s = [c];
	for (let i = 1; i < data.length; i++) {
		let c = data[i];
		if (isInDictionary(dictionary, s.concat([c]))) {
			s.push(c);
		}
		else {
			outputBytes = writeElement(outputBitPos, outputBytes, dictionary, s);
			console.log("Write Bits: ", outputBitPos, dictionary.length, i);
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
	console.log("Hey", dictionary[oldIndex]);
	while (bitPos/8 < data.length) {
		//console.log("Read Bits: ", bitPos, dictionary.length);
		let newIndex = readNumberFromBytes(getBitsPerElement(dictionary.length), bitPos, data);
		bitPos += getBitsPerElement(dictionary.length);
		let s = dictionary[newIndex];
		console.log("Hi", s, newIndex);
		//TODO output the bytes in s
		let c = s[0];
		dictionary.push(dictionary[oldIndex].concat([c]));
		oldIndex = newIndex;
	}

	return outputBytes;
}

export {compress, decompress};
