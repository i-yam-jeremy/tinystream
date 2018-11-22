

function initDictionary() {
	let dictionary = [];
	for (let i = 0; i < 256; i++) {
		dictionary.push([i]);
	}
	return dictionary;
}

function dictIndexOf(dictionary, bytePattern) {
	for (let i = 0; i < dictionary.length; i++) {
		let entry = dictionary[i];
		if (entry.length == bytePattern.length) {
			let isMatch = true;
			for (let i = 0; i < entry.length; i++) {
				if (entry[i] != bytePattern[i]) {
					isMatch = false;
					break;
				}
			}
			if (isMatch) {
				return i;
			}
		}
	}
	return -1;
}

function isInDictionary(dictionary, bytePattern) {
	return dictIndexOf(dictionary, bytePattern) != -1;
}

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

class TinyWriteStream {

	constructor() {
		this.dictionary = initDictionary();
		this.eventCallbacks = {
			'data': []
		};
	}

	write(data) {
		let compressedData = compress(this.dictionary, data);
		this.eventCallbacks['data'].forEach(f => f(compressedData));
	}

	on(eventType, callback) {
		if (eventType in this.eventCallbacks) {
			this.eventCallbacks[eventType].push(callback);
		}
		else {
			throw 'Invalid event type';
		}	
	}

}

class TinyReadStream {
	//TODO decompresses data
}




let out = new TinyWriteStream();
out.on('data', (data) => {
	console.log(data);
});
out.write(new Uint8Array([1, 2, 3, 3, 3, 3, 3, 3, 3, 3]));
