const decompress = require('./compress').decompress;
const initDictionary = require('./dict').initDictionary;

/*
	Used for decompressing data
*/
class ReadStream {

	/*
		Creates a read stream

		@param callback - (Uint8Array) -> void - called when this stream
			has decompressed data it has received
	*/
	constructor(callback) {
		this.dictionary = initDictionary();
		this.callback = callback || (data => {});		
	}

	/*
		Decompresses data and calls the callback
		To be called when compressed data is received and needs to be decompressed

		@param compressedData - Uint8Array - the compressed data
	*/
	onData(compressedData) {
		let data = decompress(this.dictionary, compressedData);
		this.callback(data);
	}

}

module.exports = {ReadStream};
