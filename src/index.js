const logger = require('./logger');
const dynamoHelper = require('./dynamo-helper');

exports.handler = async (event, context, callback) => {
	logger.log('Received event', event);

	let promises = [];

	try {
		let tables = await dynamoHelper.listTablesToBackup();
		promises = tables.map(table => {
			const tableName = dynamoHelper.stripTableNameFromArn(table.ResourceARN);
			const backupHistoryDay = dynamoHelper.getBackupHistoryDay(table);

			return dynamoHelper.backupTable(tableName).then(() => 
				dynamoHelper.maintenancePlan(tableName, backupHistoryDay)
			);
		});
	} catch (err) {
		return callback(err);
	}

	// fullfill all the promises
	Promise.all(promises)
		.then(() => callback())
		.catch(err => callback(err));
};
