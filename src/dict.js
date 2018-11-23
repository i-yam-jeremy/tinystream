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

//TODO make a LZWDict class for storing this data
export {
	initDictionary,
	dictIndexOf,
	isInDictionary
};
