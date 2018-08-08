const logger = require('./logger');
const dynamoHelper = require('./dynamo-helper');

exports.handler = async (event, context, callback) => {
	logger.log('Received event', event);

	let promises = [];

	try {
		let tables = await dynamoHelper.listTablesToBackup();
		promises = tables.map(table => {
			let tableName = dynamoHelper.stripTableNameFromArn(table.ResourceARN);
			let backupHistoryDay = dynamoHelper.getBackupHistoryDay(table);

			dynamoHelper.backupTable(tableName);
			dynamoHelper.maintenancePlan(tableName, backupHistoryDay);
		});
	} catch (err) {
		return callback(err);
	}

	// fullfill all the promises
	Promise.all(promises)
		.then(() => callback())
		.catch(err => callback(err));
};
