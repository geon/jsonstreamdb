
module.exports = StreamDb;


var PassThrough = require('stream').PassThrough;
var LineStream = require('byline').LineStream;
var StreamDbState = require('./StreamDbState.js');


function StreamDb (path, options) {

	options = options || {};
	options.objectMode = true;

	PassThrough.apply(this, [options]);

	this.aggregate = options.aggregate && new StreamDbState(this);

	// TODO: Implement persistence.

	// Read past updates from disk.
	// fs.createReadStream(path)
	// 	.pipe(new LineStream())
	// 	.pipe(this)
	// ;

	// // Write coming updates to disk.
	// this
	// 	.pipe(serialize)
	// 	.pipe(new fs.createWriteStream(path))
	// ;

	this.updates = [];
}


StreamDb.prototype.__proto__ = PassThrough.prototype;


// TODO: Remove when persistence is implemented.
StreamDb.prototype._transform = function (update) {

	this.updates.push(update);

	PassThrough.prototype._transform.apply(this, arguments);
};


StreamDb.prototype.pipe = function (destination, options) {

	if (options.history != null) {

		// Send the n latest updates from the history. Or all of them.
		(options.history === true || options.history === 0
			? this.updates
			: this.updates.slice(-options.history)
		)
			.map(destination.write.bind(destination));
	}

	// Send all coming updates.
	PassThrough.prototype.pipe.apply(this, [destination, options]);

	return destination;
}
