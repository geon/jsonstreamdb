
var Stream = require('./stream');
var TestObjectGenerator = require('./test-object-generator');

console.log('generateTestStream');

var stream = TestObjectGenerator.generateTestStream(10000);

console.log('aggregate');

var aggregate = Stream.aggregate(stream);

console.log('done');

console.log(aggregate);
