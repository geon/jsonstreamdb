
module.exports = JsonStreamDeSerializer;


var LineStream = require('byline').LineStream;
var Transform = require('stream').Transform;


function JsonStreamDeSerializer (options) {

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);

	var splitToLines = new LineStream();

	splitToLines.pipe(this);

	// Redirect any piping to the internal pipe-chain.
	this.on('pipe', function (source) {

		source.unpipe(this);
		source.pipe(splitToLines);
	});
}


JsonStreamDeSerializer.prototype.__proto__ = Transform.prototype;


JsonStreamDeSerializer.prototype._transform = function (chunk, options, callback) {

	this.push(JSON.parse(chunk.toString()));
	callback();
};
