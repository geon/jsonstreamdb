
* Split JsonStreamDb into 2 classes
	* Writing incoming data + setting the serial
	* Reading + resuming from serial
	...Or implement proper duplex interface.
* Disk cache for JsonStreamState. Periodic aggregation of all events into a single update per object uuid.
* Implement dual duplex interfaces for chat client websocket.
* Switch to chat client protocol that makes more sense client->server. No special case, just the same objects that gets stored + a layer to ensure foreign keys and user lifecycles.
* Add chat client features like
	* Resume on lost connection
	* Usernames
	* See who is in a room
	* Multiple rooms
		* Create/delete
		* Enter
* Convert to es6
* Port to typescript?
