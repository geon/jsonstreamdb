
module.exports = WebsocketStream;


var Duplex = require('stream').Duplex;


function WebsocketStream (websocket, options) {

	options = options || {};
	options.objectMode = true;

	Duplex.apply(this, [options]);

	this.websocket = websocket;

	this.websocket.on('message', function (data) {

		this.push(JSON.parse(data.utf8Data));
	}.bind(this));

	this.websocket.on('close', function(reasonCode, description) {

		this.end();
	}.bind(this));
}


WebsocketStream.prototype.__proto__ = Duplex.prototype;


WebsocketStream.prototype._write = function (chunk, encoding, callback) {

	this.websocket.send(JSON.stringify(chunk));

	callback();
};


WebsocketStream.prototype._read = function (size) {

	// Nothing to do here... The data is pushed in the constructor.
};
