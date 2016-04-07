
import JsonStreamDb from '../../JsonStreamDb';

import * as http from 'http';
import * as fs from 'fs';
import {server as WebSocketServer} from 'websocket';
import WebsocketStream from './WebsocketStream';

import ChatClient from './ChatClient';


// Serve the client static file.
const httpServer = http.createServer((request, response) => {

	fs.createReadStream('client.html').pipe(response)
});
httpServer.listen(3000);


// The chatlog.
const db = new JsonStreamDb('chatlog.jsonstreamdb');


// Set up the WS server.
const wsServer = new WebSocketServer({
	httpServer: httpServer,
	autoAcceptConnections: true
});
wsServer.on('connect', connection => {

	const chatClient = new ChatClient(
		db,
		new WebsocketStream(connection, {objectMode: true})
	);
});
