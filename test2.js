
var Stream = require('./stream');
var fs = require('fs');

var stream = Stream.generateTestStream(10000);

fs.writeFileSync('test.jsonstream', Stream.jsonObjectToJsonStream(stream));
