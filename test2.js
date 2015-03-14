
var testObjectGenerator = require('./test-object-generator');
var JsonStreamSerializer = require('./JsonStreamSerializer');
var fs = require('fs');

testObjectGenerator.generateTestStream(10000)
	.pipe(new JsonStreamSerializer())
	.pipe(fs.createWriteStream('test.jsonstreamdb'))
	.on('data', function (update) {

		console.log(update);
	});
