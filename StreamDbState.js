
module.exports = StreamDbState;


function StreamDbState () {

	this.topics = {};
}


StreamDbState.prototype.update = function (update) {

	var objects = this.topics[update.topic] || (this.topics[update.topic] = {});

	if (update.type == 'set') {

		var object = objects[update.uuid] || (objects[update.uuid] = {});

		Object.keys(update.data).forEach(function (key) {

			object[key] = update.data[key];
		});

	} else {
		// update.type == 'del'

		delete objects[update.uuid];
	}
};
