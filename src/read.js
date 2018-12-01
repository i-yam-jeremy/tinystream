import {decompress} from './compress';
import {initDictionary} from './dict';

class TinyReadStream {

	constructor(callback) {
		this.dictionary = initDictionary();
		this.callback = this.callback || (data => {});		
	}

	onData(compressedData) {
		let data = decompress(this.dictionary, compressedData);
		this.callback(data);
	}

}

export {TinyReadStream};
