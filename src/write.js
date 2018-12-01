import {compress} from './compress';
import {initDictionary} from './dict';

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

export {TinyWriteStream};
