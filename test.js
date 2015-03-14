
var Stream = require('./stream');
var StreamDbState = require('./StreamDbState.js');
var testObjectGenerator = require('./test-object-generator');

console.log('generateTestStream');

var stream = testObjectGenerator.generateTestStream(10000);

console.log('aggregate');

var aggregate = new StreamDbState();
stream.forEach(aggregate.update.bind(aggregate));

console.log('done');

console.log(aggregate.topics);
