
import LineStream from './LineStream';
import {Transform} from 'stream';

export default class JsonStreamDeSerializer extends Transform {

	constructor (options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		const splitToLines = new LineStream();

		splitToLines.pipe(this);

		// Redirect any piping to the internal pipe-chain.
		this.on('pipe', source => {

			source.unpipe(this);
			source.pipe(splitToLines);
		});
	}


	_transform (chunk, options, callback) {

		this.push(JSON.parse(chunk.toString()));
		callback();
	}

}
