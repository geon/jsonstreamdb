
import {Transform} from 'stream';
import JsonStreamDbEvent from './JsonStreamDbEvent';

export default class JsonStreamSerializer extends Transform {

	constructor (options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);
	}


	_transform (event: JsonStreamDbEvent, encoding: string, callback: Function) {

		this.push(JSON.stringify(event) + "\n");
		callback();
	}

}
