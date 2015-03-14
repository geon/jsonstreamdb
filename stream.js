
function aggregate (stream) {

	return stream.reduce(function (aggregatedTopics, update) {

		var aggregatedObjects = aggregatedTopics[update.topic] || (aggregatedTopics[update.topic] = {});

		if (update.type == 'set') {

			var objectToUpdate = aggregatedObjects[update.uuid] || (aggregatedObjects[update.uuid] = {});

			Object.keys(update.data).forEach(function (key) {

				objectToUpdate[key] = update.data[key];
			});

		} else {

			delete aggregatedObjects[update.uuid];
		}

		return aggregatedTopics;

	}, {});
}


function jsonObjectToJsonStream (stream) {

	return stream.map(function (update) {

		return JSON.stringify(update);

	}).join("\n");
}


module.exports = {
	aggregate: aggregate,
	jsonObjectToJsonStream: jsonObjectToJsonStream
}
