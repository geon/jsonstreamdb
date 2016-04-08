
import {Transform} from 'stream';

export default class JsonStreamDbSerialCounter extends Transform {

	lastSerial: number;


	constructor (lastSerial, options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.lastSerial = lastSerial;
	}


	_transform (chunk, options, callback) {

		++this.lastSerial;
		chunk.serial = this.lastSerial;
		this.push(chunk);

		callback();
	}

}
