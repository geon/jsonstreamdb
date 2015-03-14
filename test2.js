
var Stream = require('./stream');
var testObjectGenerator = require('./test-object-generator');
var fs = require('fs');

var stream = testObjectGenerator.generateTestStream(10000);

fs.writeFileSync('test.jsonstream', Stream.jsonObjectToJsonStream(stream));
