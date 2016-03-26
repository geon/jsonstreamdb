
module.exports = JsonStreamDb;


var PassThrough = require('stream').PassThrough;
var fs = require('fs');
var JsonStreamSerializer = require('./JsonStreamSerializer');
var JsonStreamDeSerializer = require('./JsonStreamDeSerializer');


function JsonStreamDb (path, options) {

	this.path = path;

	options = options || {};
	options.objectMode = true;

	PassThrough.apply(this, [options]);

	// Append coming updates to disk.
	this
		// TODO: Mark the updates as read from disk. (No side effects should be triggered.)
		.pipe(new JsonStreamSerializer())
		.pipe(new fs.createWriteStream(this.path, {'flags': 'a'}));
}


JsonStreamDb.prototype.__proto__ = PassThrough.prototype;


JsonStreamDb.prototype.pipe = function (destination, options) {

	if (options && options.history != null) {

		// Buffer incoming updates until done with disk.
		this.cork();

		// Read past updates from disk.
		var fileStream = fs.createReadStream(this.path);

		fileStream
			.pipe(new JsonStreamDeSerializer())
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


JsonStreamDb.prototype.update = function (topic, uuid, data) {

	this.write(JsonStreamDb.makeEvent('set', topic, uuid, data));
};


JsonStreamDb.prototype.delete = function (topic, uuid) {

	this.write(JsonStreamDb.makeEvent('del', topic, uuid));
};


JsonStreamDb.makeEvent = function (type, topic, uuid, data) {

	return {
		type: type,
		uuid: uuid,
		topic: topic,
		data: data
	};
};
