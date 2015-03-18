
module.exports = JsonStreamState;


var Writable = require('stream').Writable;


function JsonStreamState (options) {

	options = options || {};
	options.objectMode = true;

	Writable.apply(this, [options]);

	this.topics = {};
}


JsonStreamState.prototype.__proto__ = Writable.prototype;


JsonStreamState.prototype._write = function (update, encoding, callback) {

	var objects = this.topics[update.topic] || (this.topics[update.topic] = {});

	if (update.type == 'set') {

		var object = objects[update.uuid] || (objects[update.uuid] = {});

		Object.keys(update.data).forEach(function (key) {

			object[key] = update.data[key];
		});

	} else {
		// update.type == 'del'

		delete objects[update.uuid];
	}

	callback();
}
