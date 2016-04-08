
import * as uuid from 'uuid';
import {Transform} from 'stream';
import JsonStreamDb from '../../JsonStreamDb';


export default class ChatClient {

	uuid: string;


	constructor (db, websocketStream) {

		this.uuid = uuid.v4();

		websocketStream
			.pipe(new FromWebsocketToDb(this.uuid))
			.pipe(db)
		;

		db
			.pipe(websocketStream, {includeHistorySince: 0})
		;

		db.update('clients', this.uuid, {time: new Date()});
		websocketStream.on('end', _ => {

			db.delete('clients', this.uuid);
		});
	}
}


class FromWebsocketToDb extends Transform {

	clientId: string;


	constructor (clientId, options?) {

		options = options || {};
		options.objectMode = true;

		super(options);

		this.clientId = clientId;
	}


	_transform (message, options, callback) {

		switch (message.type) {

			case 'say':
				super.push(JsonStreamDb.makeEvent(
					'add',
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
