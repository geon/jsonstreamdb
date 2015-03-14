
var uuid = require('uuid');

var uuids = [];
for (var i = 0; i < 20; ++i) {
	uuids.push(uuid.v4());
}

var collumnNames = [
	'foo',
	'bar',
	'baz',
	'fubar',
	'time',
	'coord',
	'cost',
	'customerId',
	'projectId'
];


function generateTestUpdate () {

	var data = {};
	collumnNames.forEach(function (collumnName) {

		if (Math.random() < .2) {

			data[collumnName] = Math.floor(Math.random()*1000000);
		}
	});

	return {
		uuid: uuids[Math.floor(Math.random()*uuids.length)],
		type: 'set', // or 'del'
		data: data
	};
}


function generateTestStream (numUpdates) {

	var  stream = [];
	for(var i=0; i<numUpdates; ++i) {

		stream.push(generateTestUpdate());
	}

	return stream;
} 


module.exports = {
	generateTestUpdate: generateTestUpdate,
	generateTestStream: generateTestStream
}
