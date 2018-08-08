const logger = require('./logger');
const dynamoHelper = require('./dynamo-helper');

exports.handler = async (event, context, callback) => {
	logger.log('Received event', event);


	let promises = [];

	try {
		let tables = dynamoHelper.listTablesToBackup();
		promises = tables.map(tables => {
			dynamoHelper.backupTable(tables.)
		});
	}
	catch(err) {
		return callback(err);
	}
		.listTables()
		.then(data => {
			promises = data['AllTables'].map(table =>
				dynamoHelper.backupTable(table.ResourceARN);
				dynamoHelper.maintenancePlan(table.ResourceARN);
			);

			// fullfill all the promises
			Promise.all(promises)
				.then(() => callback())
				.catch(err => callback(err));
		})
		.catch(err => {
			callback(new Error('Unable to retrieve tables. ' + err.message));
		});
};
