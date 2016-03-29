
module.exports = JsonStreamDb;


var PassThrough = require('stream').PassThrough;
var fs = require('fs');
var JsonStreamSerializer = require('./JsonStreamSerializer');
var JsonStreamDeSerializer = require('./JsonStreamDeSerializer');
var JsonStreamDbHistoryFilter = require('./JsonStreamDbHistoryFilter');
var JsonStreamDbSerialCounter = require('./JsonStreamDbSerialCounter');


function JsonStreamDb (path, options) {

	this.path = path;

	options = options || {};
	options.objectMode = true;

	PassThrough.apply(this, [options]);

	// Buffer incoming updates until done with disk.
	this.cork();

	// Find the last serial used in the existing db.
	this.lastSerial = 0;
	fs.createReadStream(this.path)
		.pipe(new JsonStreamDeSerializer())
		.on('data', function (event) {

			this.lastSerial = event.serial;
		})
		.once('end', function () {

			// Append coming updates to disk.
			this
				// Set the serial on each update.
				.pipe(new JsonStreamDbSerialCounter(this.lastSerial))
				// TODO: Mark the updates as read from disk. (No side effects should be triggered.)
				.pipe(new JsonStreamSerializer())
				// Write incoming updates to disk.
				.pipe(new fs.createWriteStream(this.path, {'flags': 'a'}));

			// Stop buffering and flush.
			this.uncork();

		}.bind(this))
		.resume(); // Start streaming.
}


JsonStreamDb.prototype.__proto__ = PassThrough.prototype;


JsonStreamDb.prototype.pipe = function (destination, options) {

	var includeHistorySince = options && options.includeHistorySince;

	if (includeHistorySince != undefined) {

		// Buffer incoming updates until done with disk.
		this.cork();

		// Read past updates from disk.
		var fileStream = fs.createReadStream(this.path);

		fileStream
			.pipe(new JsonStreamDeSerializer())
			.pipe(new JsonStreamDbHistoryFilter(includeHistorySince))
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
