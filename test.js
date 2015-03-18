
var StreamDb = require('./StreamDb.js');
var StreamDbState = require('./StreamDbState.js');
var testObjectGenerator = require('./test-object-generator');
var JsonStreamSerializer = require('./JsonStreamSerializer');


var db = new StreamDb('test.jsonstreamdb');
// var aggregate = new StreamDbState(db);

setInterval(function () {

	testObjectGenerator.generateTestStream(1)
		.pipe(db, {end: false});
}, 500);


db
	.pipe(new JsonStreamSerializer(), {history: true})
	.pipe(process.stdout);


// db.pipe(aggregate, {history: true});

// setTimeout(function () {

// 	console.log(Object.keys(aggregate.topics).length);
// 	// console.log(aggregate.topics);

// }, 500);
