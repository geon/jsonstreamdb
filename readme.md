JsonStreamDb
============

JsonStreamDb is a toy Node.js stream database. Or something. Seriously, I have no idea what I'm doing.


Basic example
-------------

```js
var JsonStreamDb = require('jsonstreamdb');

var db = new JsonStreamDb('test.jsonstreamdb');
db.pipe(process.stdout, {history: true});

bd.create('users', '47c0479c-2083-4797-8d3c-419de31d45a7', {userName: 'geon'});
bd.update('users', '47c0479c-2083-4797-8d3c-419de31d45a7', {favoriteAnimal: 'kittens'});
bd.delete('users', '47c0479c-2083-4797-8d3c-419de31d45a7');
```


API
---

Please not that JsonStreamDb inherits stream.PassThrough. Since it is a stream, the standard stream API applies.

### JsonStreamDb(path, options)

The constructor.

* `path` - Path to file for persistence. Only one JsonStreamDb instance should ever use it at once.
* `options` - Standard stream options.



### db.pipe(options)

JsonStreamDb has an extra option; `history`. If set to `true`, `pipe` will stream the entire database from disk before giving you the "live" updates.


### db.create(topic, uuid, data)

Add a create-event to the db.

* `topic` - The topic the object belongs to.
* `uuid` - A unique id.
* `data` - The rest of the initial data.


### db.update(topic, uuid, data)

Add an update-event to the db.

* `topic` - The topic the object belongs to.
* `uuid` - The id of the object.
* `data` - The changed data.


### db.delete(topic, uuid)

Add a delete-event to the db.

* `topic` - The topic the object belongs to.
* `uuid` - The id of the object.


### JsonStreamDb.makeEvent(type, topic, uuid, data)

Create a JsonStreamDb event. You can add it to a db manually with `db.write(myEvent)`.

* `type` - The update type. One of the strings
	* 'add' - Create
	* 'set' - Update 
	* 'del' - Delete
* `topic` - The topic the object belongs to.
* `uuid` - The id of the object.
* `data` - The rest of the data.
