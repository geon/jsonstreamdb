
X Convert to es6 (well underway)
* Port to typescript?
* Add chat client features like
	* Resume on lost connection
	* Usernames
	* See who is in a room
	* Multiple rooms
		* Create/delete
		* Enter
* Add time to events so streams can resume from a point in time, not just a serial?
* Trigger "historyComplete" event on resuming streams, so they can avoid side effects while initializing from historical data.
* Object.freeze(...) objects in db, to prevent stupid mutation. Especially between sibling streams.
* Switch to chat client protocol that makes more sense client->server. No special case, just the same objects that gets stored + a layer to ensure foreign keys and user lifecycles.
* Split JsonStreamDb into 2 classes. (Should make it simple to read and write from diffrent processes. Might be nice.)
	* Writing incoming data + setting the serial
	* Reading + resuming from serial
	...Or implement proper duplex interface.
* Disk cache for JsonStreamState. Periodic aggregation of all events into a single update per object uuid.
* Implement dual duplex interfaces for chat client websocket.
