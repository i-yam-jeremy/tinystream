const decompress = require('./compress').decompress;
const initDictionary = require('./dict').initDictionary;

class ReadStream {

	constructor(callback) {
		this.dictionary = initDictionary();
		this.callback = callback || (data => {});		
	}

	onData(compressedData) {
		let data = decompress(this.dictionary, compressedData);
		this.callback(data);
	}

}

module.exports = {ReadStream};
