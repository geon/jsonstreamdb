
import LineStream from './LineStream';
import {Transform} from 'stream';
import JsonStreamDbEvent from './JsonStreamDbEvent';

export default class JsonStreamDeSerializer extends Transform {

	constructor (options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		const splitToLines = new LineStream();

		splitToLines.pipe(this);

		// TODO: Fix the any. Some typed generics stream interface?
		// Redirect any piping to the internal pipe-chain.
		this.on('pipe', (source: any) => {

			source.unpipe(this);
			source.pipe(splitToLines);
		});
	}


	_transform (chunk: string, encoding: string, callback: Function) {

		this.push(JSON.parse(chunk.toString()));
		callback();
	}

}
