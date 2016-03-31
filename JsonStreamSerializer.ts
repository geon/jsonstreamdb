
import {Transform} from 'stream';

export default function JsonStreamSerializer (options?) {

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);
}


JsonStreamSerializer.prototype.__proto__ = Transform.prototype;


JsonStreamSerializer.prototype._transform = function (chunk, options, callback) {

	this.push(JSON.stringify(chunk) + "\n");
	callback();
};
