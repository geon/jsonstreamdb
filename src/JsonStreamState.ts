
import {Writable} from 'stream';
import JsonStreamDbEvent from './JsonStreamDbEvent';


export default class JsonStreamState extends Writable {

	topics: Map<string, Map<string, any>>;


	constructor (options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.topics = new Map();
	}


	_write (update: JsonStreamDbEvent, encoding: string, callback: Function) {

		if (!this.topics.has(update.topic)) {

			this.topics.set(update.topic, new Map());
		}

		const objects = this.topics.get(update.topic);

		switch (update.type) {

			case 'set': {

				if (!objects.has(update.uuid)) {

					objects.set(update.uuid, new Map());
				}

				const object = objects.get(update.uuid);

				// TODO: Ugly.
				Array.from(update.data.keys()).forEach(key => {

					object.set(key, update.data.get(key));
				});

			} break;


			case 'del': {

				delete objects.delete(update.uuid);

			} break;


			default: {

				throw new Error(update.type+' is not a known update type.');
			}
		}

		callback();
	}

}
