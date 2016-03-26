
var uuid = require('uuid');
var Transform = require('stream').Transform;
var JsonStreamDb = require('../../JsonStreamDb.js');


module.exports = ChatClient;


function ChatClient (db, websocketStream) {

	this.uuid = uuid.v4();

	websocketStream
		.pipe(new FromWebsocketToDb(this.uuid))
		.pipe(db)
	;

	db
		.pipe(websocketStream, {history: true})
	;

	db.update('clients', this.uuid, {time: new Date()});
	websocketStream.on('end', function () {

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
