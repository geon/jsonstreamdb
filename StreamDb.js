
module.exports = StreamDb;


var PassThrough = require('stream').PassThrough;
var fs = require('fs');
var JsonStreamSerializer = require('./JsonStreamSerializer');
var JsonStreamDeSerializer = require('./JsonStreamDeSerializer');


function StreamDb (path, options) {

	this.path = path;

	options = options || {};
	options.objectMode = true;

	PassThrough.apply(this, [options]);

	// Append coming updates to disk.
	this
		.pipe(new JsonStreamSerializer())
		.pipe(new fs.createWriteStream(this.path, {'flags': 'a'}));
}


StreamDb.prototype.__proto__ = PassThrough.prototype;


StreamDb.prototype.pipe = function (destination, options) {

	if (options && options.history != null) {

		// Buffer incoming updates until done with disk.
		this.cork();

		// Read past updates from disk.
		var fileStream = fs.createReadStream(this.path);

		fileStream
			.pipe(new JsonStreamDeSerializer())

			// TODO: Mark the updates as read from disk. (No side effects should be triggered.)

 			.pipe(destination, {end: false}) // Don't close destination. Not done writing yet.
 		;

		// Pipe future (and corked) events to destination.
		fileStream
			.once('end', function () {

				PassThrough.prototype.pipe.apply(this, [destination, options]);

				// Stop buffering and flush.
				this.uncork();

			}.bind(this));

	} else {

		// Just pass through.
		PassThrough.prototype.pipe.apply(this, [destination, options]);
	}

	return destination;
};
