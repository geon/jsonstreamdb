/// <reference path="typings/node.d.ts" />

export default WebsocketStream;

import {Duplex} from 'stream';


function WebsocketStream (websocket, options) {

	options = options || {};
	options.objectMode = true;

	Duplex.apply(this, [options]);

	this.websocket = websocket;

	this.websocket.on('message', data => {

		this.push(JSON.parse(data.utf8Data));
	});

	this.websocket.on('close', (reasonCode, description) => {

		this.end();
	});
}


WebsocketStream.prototype.__proto__ = Duplex.prototype;


WebsocketStream.prototype._write = function (chunk, encoding, callback) {

	this.websocket.send(JSON.stringify(chunk));

	callback();
};


WebsocketStream.prototype._read = function (size) {

	// Nothing to do here... The data is pushed in the constructor.
};
