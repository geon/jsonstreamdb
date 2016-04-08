
import {Duplex} from 'stream';
import {connection as WebSocketConnection} from 'websocket';


export default class WebsocketStream extends Duplex {

	websocket: WebSocketConnection;


	constructor (websocket, options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.websocket = websocket;

		this.websocket.on('message', data => {

			super.push(JSON.parse(data.utf8Data));
		});

		this.websocket.on('close', (reasonCode, description) => {

			super.end();
		});
	}


	_write (chunk, encoding, callback) {

		this.websocket.send(JSON.stringify(chunk));

		callback();
	}


	_read (size) {

		// Nothing to do here... The data is pushed in the constructor.
	}

}
