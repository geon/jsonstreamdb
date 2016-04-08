
import {Transform} from 'stream';

export default class JsonStreamDbHistoryFilter extends Transform {

	includeHistorySince: number;


	constructor (includeHistorySince, options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.includeHistorySince = includeHistorySince;
	}


	_transform (chunk, options, callback) {

		// Ignore all events before includeHistorySince.
		if (chunk.serial >= this.includeHistorySince) {

			this.push(chunk);
		}

		callback();
	}

}
