/// <reference path="typings/node.d.ts" />

export default JsonStreamDbSerialCounter;

import {Transform} from 'stream';

function JsonStreamDbSerialCounter (lastSerial, options) {

	this.lastSerial = lastSerial;

	options = options || {};
	options.objectMode = true;

	Transform.apply(this, [options]);
}


JsonStreamDbSerialCounter.prototype.__proto__ = Transform.prototype;


JsonStreamDbSerialCounter.prototype._transform = function (chunk, options, callback) {

	++this.lastSerial;
	chunk.serial = this.lastSerial;
	this.push(chunk);

	callback();
};
