
var JsonStreamDb = require('../JsonStreamDb.js');
var JsonStreamState = require('../JsonStreamState.js');
var testObjectGenerator = require('./test-object-generator.js');
var JsonStreamSerializer = require('../JsonStreamSerializer.js');


var db = new JsonStreamDb('test.jsonstreamdb');
// var aggregate = new JsonStreamState(db);

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
