/*
	Data Definitions:

	A Dictionary is a DictionaryElement[]
		* a dictionary is a LZW dictionary used to store patterns
		* the index in the dictionary is the LZW code for the byte pattern

	A DictionaryElement is byte[]
		* a dictionary element is a byte pattern
*/


/*
	Creates a dictionary solely containing all singleton byte patterns

	@return - Dictionary - a dictionary containing only all the possible 
		single byte patterns
*/
function initDictionary() {
	let dictionary = [];
	for (let i = 0; i < 256; i++) {
		dictionary.push([i]);
	}
	return dictionary;
}

/*
	Returns true iff the corresponding values in both arrays are equal
		(the values are compared shallowly)

	@param arr1 - Array - the first array
	@param arr2 - Array - the second array

	@return - boolean - whether or not the arrays are equal	
*/
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

/*
	Returns the index of the given pattern in the given dictionary

	@param dictionary - Dictionary - the dictionary
	@param pattern - byte[] - the pattern to search for in the dictionary

	@return - integer - the index if the pattern is in the dictionary, otherwise -1
*/
function dictIndexOf(dictionary, pattern) {
	for (let i = 0; i < dictionary.length; i++) {
		let entry = dictionary[i];
		if (arrayEquals(entry, pattern)) {
			return i;
		}
	}
	return -1;
}

/*	
	Returns true iff the given dictionary contains the given pattern

	@param dictionary - Dictionary - the dictionary
	@param pattern - byte[] - the pattern to search for in the dictionary

	@return - boolean - whether or not the pattern is in the dictionary
*/
function isInDictionary(dictionary, pattern) {
	return dictIndexOf(dictionary, pattern) != -1;
}

module.exports = {
	initDictionary,
	arrayEquals,
	dictIndexOf,
	isInDictionary
};
