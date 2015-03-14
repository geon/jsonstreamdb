
var Stream = require('./stream');
var testObjectGenerator = require('./test-object-generator');

console.log('generateTestStream');

var stream = testObjectGenerator.generateTestStream(10000);

console.log('aggregate');

var aggregate = Stream.aggregate(stream);

console.log('done');

console.log(aggregate);
