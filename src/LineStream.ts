// Copyright (C) 2011-2015 John Hewson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

// A port of https://github.com/jahewson/node-byline , because I couldn't get
// the typescript compiler to import it. :P
// /geon


import {Transform, Readable} from 'stream';

export default LineStream;

class LineStream extends Transform {

	_lineBuffer: Array<string>;
	_lastChunkEndedWithCR: boolean;
	_keepEmptyLines: boolean;
	_chunkEncoding: string;


	constructor (options?) {

		// use objectMode to stop the output from being buffered
		// which re-concatanates the lines, just without newlines.
		options = options || {};
		options.objectMode = true
		super(options);

		this._lineBuffer = [];
		this._keepEmptyLines = options.keepEmptyLines || false;
		this._lastChunkEndedWithCR = false;
	}


	_transform (chunk, encoding, done) {

		// decode binary chunks as UTF-8
		encoding = encoding || 'utf8';
		
		if (Buffer.isBuffer(chunk)) {
			if (encoding == 'buffer') {
				chunk = chunk.toString(); // utf8
				encoding = 'utf8';
			}
			else {
			 chunk = chunk.toString(encoding);
			}
		}
		this._chunkEncoding = encoding;
		
		var lines = chunk.split(/\r\n|\r|\n/g);
		
		// don't split CRLF which spans chunks
		if (this._lastChunkEndedWithCR && chunk[0] == '\n') {
			lines.shift();
		}
		
		if (this._lineBuffer.length > 0) {
			this._lineBuffer[this._lineBuffer.length - 1] += lines[0];
			lines.shift();
		}

		this._lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r';
		this._lineBuffer = this._lineBuffer.concat(lines);
		this._pushBuffer(encoding, 1, done);
	}

	_pushBuffer (encoding, keep, done) {

		// always buffer the last (possibly partial) line
		while (this._lineBuffer.length > keep) {
			var line = this._lineBuffer.shift();
			// skip empty lines
			if (this._keepEmptyLines || line.length > 0 ) {
				if (!this.push(this._reencode(line, encoding))) {
					// when the high-water mark is reached, defer pushes until the next tick
					var self = this;
					setImmediate(function() {
						self._pushBuffer(encoding, keep, done);
					});
					return;
				}
			}
		}
		done();
	}

	_flush (done) {

		this._pushBuffer(this._chunkEncoding, 0, done);
	}

	// see Readable::push
	_reencode (line, chunkEncoding) {

		return new Buffer(line, chunkEncoding);
	}
}
