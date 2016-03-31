
export default JsonStreamDeSerializer;

import {LineStream} from 'byline';
import {Transform} from 'stream';

function JsonStreamDeSerializer (options) {

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);

	var splitToLines = new LineStream();

	splitToLines.pipe(this);

	// Redirect any piping to the internal pipe-chain.
	this.on('pipe', source => {

		source.unpipe(this);
		source.pipe(splitToLines);
	});
}


JsonStreamDeSerializer.prototype.__proto__ = Transform.prototype;


JsonStreamDeSerializer.prototype._transform = function (chunk, options, callback) {

	this.push(JSON.parse(chunk.toString()));
	callback();
};
