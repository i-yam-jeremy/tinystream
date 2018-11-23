import {TinyWriteStream} from './write';
import {TinyReadStream} from './read';

export {TinyWriteStream, TinyReadStream};

/*let out = new TinyWriteStream();
out.on('data', (data) => {
	console.log(data);
});
out.write(new Uint8Array([1, 2, 3, 3, 3, 3, 3, 3, 3, 3]));*/
