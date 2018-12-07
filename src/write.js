const compress = require('./compress').compress;
const initDictionary = require('./dict').initDictionary;

/*
	Used for compressing data
*/
class WriteStream {

	/*
		Creates a write stream

		@param callback - (Uint8Array) -> void - called when this stream
			has compressed data it that has been written to it
	*/
	constructor(callback) {
		this.dictionary = initDictionary();
		this.callback = callback || (data => {});
	}

	/*
		Compresses data and calls the callback
		To be called when data needs to be compressed

		@param data - Uint8Array - the data to be compressed
	*/
	write(data) {
		let compressedData = compress(this.dictionary, data);
		this.callback(compressedData);
	}

}

module.exports = {WriteStream};
