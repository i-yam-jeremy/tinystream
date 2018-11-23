import {compress} from './compress';
import {initDictionary} from './dict';

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

export {TinyWriteStream};
