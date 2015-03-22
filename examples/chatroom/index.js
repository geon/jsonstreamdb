
var JsonStreamDb = require('../../JsonStreamDb.js');
var JsonStreamState = require('../../JsonStreamState.js');
var JsonStreamSerializer = require('../../JsonStreamSerializer.js');

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

	db.pipe(new WebsocketStream(connection, {objectMode: true}), {history: true});

	var chatClient = new ChatClient(db);

	connection.on('message', function(data) {

		var message = JSON.parse(data.utf8Data);

		switch (message.type) {

			case 'say':
				chatClient.say(message.line);
				break;

			default:
				console.error(new Date(), 'Unknown message type:', message);
				break;
		}
	});

	connection.on('close', function(reasonCode, description) {

		chatClient.destroy();
	});
});
