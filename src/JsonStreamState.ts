
import {Writable} from 'stream';


export default class JsonStreamState extends Writable {

	// TODO: Change to Map.
	topics: {};

	constructor (options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.topics = {};
	}


	_write (update, encoding, callback) {

		const objects = this.topics[update.topic] || (this.topics[update.topic] = {});

		switch (update.type) {

			case 'set': {

				const object = objects[update.uuid] || (objects[update.uuid] = {});

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

}
