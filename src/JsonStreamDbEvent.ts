
export default class JsonStreamDbEvent {

	type: 'set' | 'del';
	uuid: string;
	serial: number;
	topic: string;
	data: Map<string, any>;


	// TODO: Check input and throw if missing. This is typed, but data from disk will be `any`, so ignore it.
	// TODO: Can this be overloaded?
	// constructor (type: 'set', topic: string, uuid: string, data: any);
	// constructor (type: 'del', topic: string, uuid: string);
	constructor (json: {
		type: 'set' | 'del',
		topic: string,
		uuid: string,
		data?: {[key: string]: any}
	}) {

		// Convert the conveinient hash argument to a proper map.
		const dataMap = new Map(Object.keys(json.data)
			.map(key => <[string, any]> [key, json.data[key]])
		);

		this.type = json.type;
		this.topic = json.topic;
		this.uuid = json.uuid;
		this.data = dataMap;
	}


	// Called by JSON.stringify().
	toJSON () {

		// Convert the proper Map to a serializable hash.
		const data: {[key: string]: any} = {};
		Array.from(this.data).forEach(
			([key, value]) => { data[key] = value; }
		);

		return {
			type: this.type,
			topic: this.topic,
			uuid: this.uuid,
			data: data
		};
	}

}
