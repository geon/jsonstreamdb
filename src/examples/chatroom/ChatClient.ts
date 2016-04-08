
import * as uuid from 'uuid';
import {Transform} from 'stream';
import JsonStreamDb from '../../JsonStreamDb';
import WebsocketStream from './WebsocketStream'; 
import JsonStreamDbEvent from '../../JsonStreamDbEvent';


export default class ChatClient {

	uuid: string;


	constructor (db: JsonStreamDb, websocketStream: WebsocketStream) {

		this.uuid = uuid.v4();

		websocketStream
			.pipe(new FromWebsocketToDb(this.uuid))
			.pipe(db)
		;

		db
			.pipe(websocketStream, {includeHistorySince: 0})
		;

		db.update('clients', this.uuid, {time: new Date()});
		websocketStream.on('end', () => {

			db.delete('clients', this.uuid);
		});
	}
}


class FromWebsocketToDb extends Transform {

	clientId: string;


	constructor (clientId: string, options?: any) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.clientId = clientId;
	}


	_transform (message:any, encoding: string, callback: Function) {

		switch (message.type) {

			case 'say':
				super.push(new JsonStreamDbEvent(
					'set',
					'lines',
					uuid.v4(),
					{
						time: new Date(),
						clientId: this.clientId,
						line: message.line
					}
				));
				break;

			default:
				console.error(new Date(), 'Unknown message type:', message);
				break;
		}

		callback();
	}

}
