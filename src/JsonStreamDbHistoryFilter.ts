
import {Transform} from 'stream';
import JsonStreamDbEvent from './JsonStreamDbEvent';

export default class JsonStreamDbHistoryFilter extends Transform {

	includeHistorySince: number;


	constructor (includeHistorySince: number, options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.includeHistorySince = includeHistorySince;
	}


	_transform (chunk: JsonStreamDbEvent, encoding: string, callback: Function) {

		// Ignore all events before includeHistorySince.
		if (chunk.serial >= this.includeHistorySince) {

			this.push(chunk);
		}

		callback();
	}

}
