import {isInDictionary, dictIndexOf} from './dict';
import {lzwElementsToBytes} from './bits';

function compress(dictionary, data) {
	let lzwElements = [];
	let s = [];
	for (let i = 0; i < data.length; i++) {
		let c = data[i];
		if (isInDictionary(dictionary, s.concat([c]))) {
			s.push(c);
		}
		else {
			lzwElements.push(dictIndexOf(dictionary, s));
			dictionary.push(s.concat([c]));
			s = [c];
		}
	}
	lzwElements.push(dictIndexOf(dictionary, s));

	return lzwElementsToBytes(dictionary.length, lzwElements);
}

function decompress(/*TODO*/) {
	//TODO
}

export {compress, decompress};
