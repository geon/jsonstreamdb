
var JsonStreamDb = require('../../JsonStreamDb.js');

var http = require('http');
var fs = require('fs')
var WebSocketServer = require('websocket').server
var WebsocketStream = require('./WebsocketStream.js');

var ChatClient = require('./ChatClient.js');


// Serve the client static file.
var httpServer = http.createServer(function (request, response) {

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
wsServer.on('connect', function(connection) {

	var chatClient = new ChatClient(
		db,
		new WebsocketStream(connection, {objectMode: true})
	);
});
