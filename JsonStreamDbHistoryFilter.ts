
import {Transform} from 'stream';

export default function JsonStreamDbHistoryFilter (includeHistorySince, options?) {

	this.includeHistorySince = includeHistorySince;

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);
}


JsonStreamDbHistoryFilter.prototype.__proto__ = Transform.prototype;


JsonStreamDbHistoryFilter.prototype._transform = function (chunk, options, callback) {

	// Ignore all events before includeHistorySince.
	if (chunk.serial >= this.includeHistorySince) {

		this.push(chunk);
	}

	callback();
};
