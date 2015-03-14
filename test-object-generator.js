
var uuid = require('uuid');

function randomElement (array) {

	return array[Math.floor(Math.random()*array.length)];
}

var topicNames = [
	'posts',
	'authors',
	'customers',
	'projects',
	'issues',
	'invoices'
];
function makeTopic (name) {

	var uuids = [];
	for (var i = 0; i < 20; ++i) {
		uuids.push(uuid.v4());
	}

	return {
		name: name,
		uuids: uuids
	}
}
var topics = topicNames.map(makeTopic);

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

	var topic = randomElement(topics);

	var data = {};
	collumnNames.forEach(function (collumnName) {

		if (Math.random() < .2) {

			data[collumnName] = Math.floor(Math.random()*1000000);
		}
	});

	return {
		type: 'set', // or 'del'
		uuid: randomElement(topic.uuids),
		topic: topic.name,
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
