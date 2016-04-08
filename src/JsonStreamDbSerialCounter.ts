
import {Transform} from 'stream';
import JsonStreamDbEvent from './JsonStreamDbEvent';

export default class JsonStreamDbSerialCounter extends Transform {

	lastSerial: number;


	constructor (lastSerial: number, options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.lastSerial = lastSerial;
	}


	_transform (chunk: JsonStreamDbEvent, encoding: string, callback: Function) {

		++this.lastSerial;
		chunk.serial = this.lastSerial;
		this.push(chunk);

		callback();
	}

}
