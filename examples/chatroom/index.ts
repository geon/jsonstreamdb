
import JsonStreamDb from '../../JsonStreamDb.js';

import http from 'http';
import * as fs from 'fs';
import {server as WebSocketServer} from websocket;
import WebsocketStream from './WebsocketStream.js';

var ChatClient = require('./ChatClient.js');


// Serve the client static file.
var httpServer = http.createServer((request, response) => {

	fs.createReadStream('client.html').pipe(response)
});
httpServer.listen(3000);


// The chatlog.
var db = new JsonStreamDb('chatlog.jsonstreamdb');


// Set up the WS server.
wsServer = new WebSocketServer({
	httpServer: httpServer,
	autoAcceptConnections: true
});
wsServer.on('connect', connection => {

	var chatClient = new ChatClient(
		db,
		new WebsocketStream(connection, {objectMode: true})
	);
});
