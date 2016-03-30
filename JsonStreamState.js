
import {Writable} from 'stream';


export default  function JsonStreamState (options) {

	options = options || {};
	options.objectMode = true;

	Writable.apply(this, [options]);

	this.topics = {};
}


JsonStreamState.prototype.__proto__ = Writable.prototype;


JsonStreamState.prototype._write = function (update, encoding, callback) {

	var objects = this.topics[update.topic] || (this.topics[update.topic] = {});

	switch (update.type) {

		case 'set': {

			var object = objects[update.uuid] || (objects[update.uuid] = {});

			Object.keys(update.data).forEach(key => {

				object[key] = update.data[key];
			});

		} break;


		case 'del': {

			delete objects[update.uuid];

		} break;


		default: {

			throw new Error(update.type+' is not a known update type.');
		}
	}

	callback();
}
