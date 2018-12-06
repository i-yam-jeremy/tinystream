function initDictionary() {
	let dictionary = [];
	for (let i = 0; i < 256; i++) {
		dictionary.push([i]);
	}
	return dictionary;
}

function arrayEquals(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return false;
	}
	
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}
	
	return true;
}

function dictIndexOf(dictionary, pattern) {
	for (let i = 0; i < dictionary.length; i++) {
		let entry = dictionary[i];
		if (arrayEquals(entry, pattern)) {
			return i;
		}
	}
	return -1;
}

function isInDictionary(dictionary, pattern) {
	return dictIndexOf(dictionary, pattern) != -1;
}

module.exports = {
	initDictionary,
	arrayEquals,
	dictIndexOf,
	isInDictionary
};
