
var Stream = require('./stream');

console.log('generateTestStream');

var stream = Stream.generateTestStream(10000);

console.log('aggregate');

var aggregate = Stream.aggregate(stream);

console.log('done');

console.log(aggregate);
