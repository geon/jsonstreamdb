
function jsonObjectToJsonStream (stream) {

	return stream.map(function (update) {

		return JSON.stringify(update);

	}).join("\n");
}


module.exports = {
	jsonObjectToJsonStream: jsonObjectToJsonStream
}
