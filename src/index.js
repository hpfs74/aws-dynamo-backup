const logger = require('./logger');
const dynamoHelper = require('./dynamo-helper');

let genProcessedTableList;
exports.genProcessedTableList = genProcessedTableList = async function () {
	const tables = await dynamoHelper.listTablesToBackup();
	return (function* () {
		for (const tableItem of tables) {
			yield {
				tableName: dynamoHelper.stripTableNameFromArn(tableItem.ResourceARN),
				backupHistoryDay: dynamoHelper.getBackupHistoryDay(tableItem)
			};
		}
	})();
};

let genPromises;
exports.getPromises = genPromises = function (tables) {
	return Array.from(tables, (table) => {
		return dynamoHelper.backupTable(table.tableName).then(() =>
			dynamoHelper.maintenancePlan(table.tableName, table.backupHistoryDay)
		);
	});
};

exports.handler = async (event, context, callback) => {
	logger.log('Received event', event);

	try {
		let tables = await genProcessedTableList();
		await Promise.all(genPromises(tables));
		callback();
	} catch (err) {
		return callback(err);
	}
};
