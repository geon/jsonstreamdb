
var JsonStreamDb = require('../../JsonStreamDb.js');

var http = require('http');
var fs = require('fs')
var WebSocketServer = require('websocket').server
var WebsocketStream = require('./WebsocketStream.js');

var ChatClient = require('./ChatClient.js');



var httpServer = http.createServer(function (request, response) {

	request.pipe(process.stdout);

	fs.createReadStream('client.html').pipe(response)
});

httpServer.listen(3000);



wsServer = new WebSocketServer({
	httpServer: httpServer,
	autoAcceptConnections: true
});

var db = new JsonStreamDb('chatlog.jsonstreamdb');

wsServer.on('connect', function(connection) {

	var chatClient = new ChatClient(
		db,
		new WebsocketStream(connection, {objectMode: true})
	);
});
