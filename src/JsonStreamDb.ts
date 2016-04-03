/// <reference path="typings/node.d.ts" />

export default JsonStreamDb;

import {PassThrough} from 'stream';
import * as fs from 'fs';
import JsonStreamSerializer from './JsonStreamSerializer';
import JsonStreamDeSerializer from './JsonStreamDeSerializer';
import JsonStreamDbHistoryFilter from './JsonStreamDbHistoryFilter';
import JsonStreamDbSerialCounter from './JsonStreamDbSerialCounter';


class JsonStreamDb extends PassThrough {

	path: string;
	lastSerial: number;


	constructor (path, options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.path = path;

		// TODO: Apparently, cork is not part of the PassThrough. Oops.
		// Just goes to show TypeScript is worthwile.
		// // Buffer incoming updates until done with disk.
		// super.cork();

		// Find the last serial used in the existing db.
		this.lastSerial = 0;
		fs.createReadStream(this.path)
			.pipe(new JsonStreamDeSerializer())
			.on('data', event => {

				this.lastSerial = event.serial;
			})
			.once('end', _ => {

				// Append coming updates to disk.
				super
					// Set the serial on each update.
					.pipe(new JsonStreamDbSerialCounter(this.lastSerial))
					// Write incoming updates to disk.
					.pipe(new JsonStreamSerializer())
					.pipe(fs.createWriteStream(this.path, {'flags': 'a'}));

				// TODO: Does not exist on PassThrough.
				// // Stop buffering and flush.
				// super.uncork();

			})
			.resume(); // Start streaming.
	}


	pipe (destination, options) {

		const includeHistorySince = options && options.includeHistorySince;

		if (includeHistorySince != undefined) {

			// TODO: Does not exist on PassThrough.
			// // Buffer incoming updates until done with disk.
			// super.cork();

			// Read past updates from disk.
			const fileStream = fs.createReadStream(this.path);

			fileStream
				.pipe(new JsonStreamDeSerializer())
				.pipe(new JsonStreamDbHistoryFilter(includeHistorySince))
	 			.pipe(destination, {end: false}) // Don't close destination. Not done writing yet.
	 		;

			// Pipe future (and corked) events to destination.
			fileStream
				.once('end', _ => {

					PassThrough.prototype.pipe.apply(this, [destination, options]);

					// TODO: Does not exist on PassThrough.
					// // Stop buffering and flush.
					// this.uncork();
				});

		} else {

			// Just pass through.
			PassThrough.prototype.pipe.apply(this, [destination, options]);
		}

		return destination;
	}


	update (topic, uuid, data) {

		this.write(JsonStreamDb.makeEvent('set', topic, uuid, data));
	}


	delete (topic, uuid) {

		this.write(JsonStreamDb.makeEvent('del', topic, uuid));
	}


	// TODO: Remove this? Typing is awkward.
	static makeEvent (type, topic, uuid, data?) {

		// TODO: Throw on missing arguments.

		return {
			type: type,
			uuid: uuid,
			topic: topic,
			data: data
		};
	}

}
