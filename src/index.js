
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

function compress(dictionary, data) {
	let outputData = [];
	let s = [];
	for (let i = 0; i < data.length; i++) {
		let c = data[i];
		if (isInDictionary(dictionary, s.concat([c]))) {
			s.push(c);
		}
		else {
			outputData.push(dictIndexOf(dictionary, s));
			dictionary.push(s.concat([c]));
			s = [c];
		}
	}
	outputData.push(dictIndexOf(dictionary, s));
	console.log(outputData);
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
out.write(new Uint8Array([1, 2, 3, 3, 3, 3, 3, 3, 3, 3]));
