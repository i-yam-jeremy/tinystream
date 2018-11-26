import {isInDictionary, dictIndexOf} from './dict';
import {putNumberInBytes} from './bits';

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
			dictionary.push(s.concat([c]));
			s = [c];
		}
	}
	outputBytes = writeElement(outputBitPos, outputBytes, dictionary, s);

	return outputBytes.slice(0, Math.ceil(outputBitPos/8));
}

function decompress(/*TODO*/) {
	//TODO
}

export {compress, decompress};
