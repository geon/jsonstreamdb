
var StreamDb = require('./StreamDb.js');
var testObjectGenerator = require('./test-object-generator');


var db = new StreamDb(null, {aggregate: true});

testObjectGenerator.generateTestStream(10000).forEach(function (update) {

	db.write(update);
});

console.log(Object.keys(db.aggregate.topics).length);
console.log(db.updates.length);
