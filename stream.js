
function generateTestStream (numUpdates) {

	var uuids = [
		'6b14c82c-6058-4cee-99d1-2a6267fc9547',
		'12bd6c32-c98c-4139-8206-fc7cd41a3878',
		'16fc222d-ca99-442f-a4aa-cf5a6ff0dcd7',
		'781f96fa-6406-49e1-875e-9ab63c10baf4',
		'35f6292b-34f4-4385-a106-a63e327e22dc',
		'cf3d5a1b-dd6d-43aa-959a-08eabe304431',
		'16ef74b8-3402-4cdd-9d63-c31f72241a49',
		'22de82bb-99b8-4e75-b514-a4d5c36ef163',
		'a31ddadc-7468-4918-b4a7-bf6c31191eb3',
		'511173a3-01e8-488b-91cd-33ccef86a1c2',
		'89596b4f-c8a9-439c-b4bb-a50171d870d7',
		'77f31b6e-3d8b-4dd9-839e-4c68ff8ae113',
		'bf638d14-b5c8-47d1-ad7a-a4f790105087',
		'e2486d4a-4ab8-45a3-acea-49d2e7bc8887',
		'4fd086b3-4691-4be7-99d1-fb46778382f4',
		'47553c9c-6b64-4558-a9b5-75036fb906d2',
		'5979b8f2-296e-49dd-b668-962c0e67817d',
		'3b39acc5-6746-4f61-9380-ea51762b7492',
		'095cb874-f9ce-439a-8ee4-8caa8fa9300b',
		'89450132-f452-4747-a2b1-0f02c2f85b14',
		'282e227f-766e-42e8-b27b-dcfacf311293',
		'd3f0a85f-0c05-4e85-9893-00b031c69995',
		'd59a5771-1eb0-4191-abf7-18a14e74250c',
		'9068b595-9eb5-41d1-a9d2-c33c87e7ea56',
		'99018da6-25a3-49ae-923b-aa0779d93e0a',
		'f3a4bd56-ceaa-49db-9650-da8a1bfd5aae',
		'e3c22b34-4a7c-47a5-b013-90314cf639fd',
		'25e8989d-79d9-4bc3-9ddc-85b133c2ca2a',
		'e51cd598-4d3e-41f5-9027-1d330867241b',
		'c7fe2dfb-c82b-4bb5-a9aa-76c6d572f56d',
		'56368f34-a68b-4f39-88e5-c2e751e652d1',
		'728e29f1-d8b7-488f-a087-bd7169ec2052',
		'4bc313d3-162a-466a-9cce-27c93ba568fa',
		'6b778422-108a-4edb-807c-149c9a3b69a9',
		'51b69c77-c675-4a7d-9bb2-dee556c43e17',
		'ff834e53-717b-4fd7-b5fe-4b8961aa859f',
		'1e4c5f4d-d9b6-435f-9e94-7d370846de61',
		'67ff923c-ad93-4b9f-9e33-cb8d5c27b020',
		'243b2f62-e4f7-44de-b8cf-b3eeb23bab40',
		'637853d6-57b1-4b87-8054-4439bed7edd0'
	];


	var collumnNames = [
		'foo',
		'bar',
		'baz',
		'fubar',
		'time',
		'coord',
		'cost',
		'customerId',
		'projectId'
	];

	var  stream = [];
	for(var i=0; i<numUpdates; ++i) {

		var data = {};
		collumnNames.forEach(function (collumnName) {

			if (Math.random() < .2) {

				data[collumnName] = Math.floor(Math.random()*1000000);
			}
		});

		stream.push({
			uuid: uuids[Math.floor(Math.random()*uuids.length)],
			type: 'set', // or 'del'
			data: data
		});
	}

	return stream;
} 


function aggregate (stream) {

	return stream.reduce(function (aggregatedObjects, update) {

		if (update.type == 'set') {

			var objectToUpdate = aggregatedObjects[update.uuid] || (aggregatedObjects[update.uuid] = {});

			Object.keys(update.data).forEach(function (key) {

				objectToUpdate[key] = update.data[key];
			});

		} else {

			delete aggregatedObjects[update.uuid];
		}

		return aggregatedObjects;

	}, {});
}


function jsonObjectToJsonStream (stream) {

	return stream.map(function (update) {

		return JSON.stringify(update);

	}).join("\n");
}


module.exports = {
	aggregate: aggregate,
	generateTestStream: generateTestStream,
	jsonObjectToJsonStream: jsonObjectToJsonStream
}
