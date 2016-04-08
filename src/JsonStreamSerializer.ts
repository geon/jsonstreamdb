
import {Transform} from 'stream';

export default class JsonStreamSerializer extends Transform {

	constructor (options?) {

		options = options || {};
		options.objectMode = true;

		super(options);
	}


	_transform (chunk, options, callback) {

		this.push(JSON.stringify(chunk) + "\n");
		callback();
	}

}
