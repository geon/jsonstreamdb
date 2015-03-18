
module.exports = JsonStreamDeSerializer;


var PassThrough = require('stream').PassThrough;
var LineStream = require('byline').LineStream;
var Transform = require('stream').Transform;


function JsonStreamDeSerializer (options) {

	options = options || {};
	options.objectMode = true;

	PassThrough.apply(this, [options]);

	this.firstStep = new LineStream();
	this.lastStep = new DeSerializer(options);

	this.firstStep.pipe(this.lastStep);

	// Redirect any piping to the internal pipe-chain.
	this.on('pipe', function (source) {

		source.unpipe(this);
		source.pipe(this.firstStep);
	});

	// TODO: Proxy the data event.
}


JsonStreamDeSerializer.prototype.__proto__ = PassThrough.prototype;


JsonStreamDeSerializer.prototype.pipe = function (destination, options) {

	this.lastStep.pipe(destination, options)
	return destination;
};





function DeSerializer (options) {

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);
}


DeSerializer.prototype.__proto__ = Transform.prototype;


DeSerializer.prototype._transform = function (chunk, options, callback) {

	this.push(JSON.parse(chunk.toString()));
	callback();
};
