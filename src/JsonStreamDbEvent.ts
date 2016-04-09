
// TODO: Change to Map.
type Data = {
	[key: string]: any;
}

export default class JsonStreamDbEvent {

	type: 'set' | 'del';
	uuid: string;
	serial: number;
	topic: string;
	data: Data;


	// TODO: Check input and throw if missing. This is typed, but data from disk will be `any`, so ignore it.
	// TODO: Can this be overloaded?
	// constructor (type: 'set', topic: string, uuid: string, data: any);
	// constructor (type: 'del', topic: string, uuid: string);
	constructor (type: 'set' | 'del', topic: string, uuid: string, data?: Data) {

		this.type = type;
		this.topic = topic;
		this.uuid = uuid;
		this.data = data;
	}

}
