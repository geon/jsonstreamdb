
var Stream = require('./stream');
var TestObjectGenerator = require('./test-object-generator');
var fs = require('fs');

var stream = TestObjectGenerator.generateTestStream(10000);

fs.writeFileSync('test.jsonstream', Stream.jsonObjectToJsonStream(stream));
