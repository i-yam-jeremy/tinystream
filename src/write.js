const compress = require('./compress').compress;
const initDictionary = require('./dict').initDictionary;

class TinyWriteStream {

	constructor(callback) {
		this.dictionary = initDictionary();
		this.callback = callback || (data => {});
	}

	write(data) {
		let compressedData = compress(this.dictionary, data);
		this.callback(compressedData);
	}

}

module.exports = {TinyWriteStream};
