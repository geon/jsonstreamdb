
var uuid = require('uuid');


module.exports = ChatClient;


function ChatClient (db) {

	this.db = db;
	this.uuid = uuid.v4();

	this.db.create('clients', this.uuid, {time: new Date()});
}


ChatClient.prototype.say = function (line) {

	this.db.create('lines', uuid.v4(), {time: new Date(), clientId: this.uuid, line: line});
};


ChatClient.prototype.destroy = function () {

	this.db.delete('clients', this.uuid);
};
