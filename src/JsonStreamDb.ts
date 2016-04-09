
import {PassThrough} from 'stream';
import * as fs from 'fs';
import JsonStreamDbEvent from './JsonStreamDbEvent';
import JsonStreamSerializer from './JsonStreamSerializer';
import JsonStreamDeSerializer from './JsonStreamDeSerializer';
import JsonStreamDbHistoryFilter from './JsonStreamDbHistoryFilter';
import JsonStreamDbSerialCounter from './JsonStreamDbSerialCounter';


export default class JsonStreamDb extends PassThrough {

	path: string;
	lastSerial: number;


	constructor (path: string, options?: any) {

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
			.on('data', (event: JsonStreamDbEvent) => {

				this.lastSerial = event.serial;
			})
			.once('end', () => {

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


	// TODO: Fix the any. The WriteStream interface from the node typings?
	pipe (destination: any, options: any) {

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
				.once('end', () => {

					super.pipe.apply(this, [destination, options]);

					// TODO: Does not exist on PassThrough.
					// // Stop buffering and flush.
					// this.uncork();
				});

		} else {

			// Just pass through.
			super.pipe.apply(this, [destination, options]);
		}

		return destination;
	}


	update (topic: string, uuid: string, data: {[key: string]: any}) {

		super.write(new JsonStreamDbEvent({
			type:'set',
			topic,
			uuid,
			data
		}));
	}


	delete (topic: string, uuid: string) {

		super.write(new JsonStreamDbEvent({
			type:'del',
			topic,
			uuid
		}));
	}

}
