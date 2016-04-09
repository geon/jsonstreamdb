
import {Duplex} from 'stream';
import {connection as WebSocketConnection} from 'websocket';
import JsonStreamDbEvent from '../../JsonStreamDbEvent';


export default class WebsocketStream extends Duplex {

	websocket: WebSocketConnection;


	constructor (websocket: WebSocketConnection, options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.websocket = websocket;

		this.websocket.on('message', data => {

			// Still a raw json object, not an JsonStreamDbEvent.
			super.push(JSON.parse(data.utf8Data));
		});

		this.websocket.on('close', (reasonCode, description) => {

			super.end();
		});
	}


	_write (event: JsonStreamDbEvent, encoding: string, callback: Function) {

		this.websocket.send(JSON.stringify(event));

		callback();
	}


	_read (size: number) {

		// Nothing to do here... The data is pushed in the constructor.
	}

}
