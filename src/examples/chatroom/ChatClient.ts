
import * as uuid from 'uuid';
import {Transform} from 'stream';
import JsonStreamDb from '../../JsonStreamDb.js';


export default ChatClient;


function ChatClient (db, websocketStream) {

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


function FromWebsocketToDb (clientId, options) {

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);

	this.clientId = clientId;
}


FromWebsocketToDb.prototype.__proto__ = Transform.prototype;


FromWebsocketToDb.prototype._transform = function (message, options, callback) {

	switch (message.type) {

		case 'say':
			this.push(JsonStreamDb.makeEvent(
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
};
