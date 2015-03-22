
module.exports = WebsocketStream;


var Duplex = require('stream').Duplex;


function WebsocketStream (websocket, options) {

	options = options || {};
	options.objectMode = true;

	Duplex.apply(this, [options]);

	this.websocket = websocket;

	this.websocket.on('message', function (data) {

		this.push(data);
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
