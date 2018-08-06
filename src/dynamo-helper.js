const logger = require('./logger');
const getBackupTableName = require('./serial-number').getBackupTableName;
const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();

/**
 * printData - dump table information
 *
 * @param  {type} tablename the table name
 * @return {type}           none
 */
function printData(tablename) {
	logger.log('data: ' + tablename);
}

/**
 * backupTable - create a promise to execute the backup of the dynamodb table
 *
 * @param  {type} tableName dynamodb table name
 * @return {type}           a promise
 */
function backupTable(tableName) {
	const params = {
		TableName: tableName,
		BackupName: getBackupTableName(tableName)
	};

	logger.log(params);

	return dynamodb.createBackup(params).promise();
}

/**
 * listTables - return the list of all the dynamodb tables in the current role.
 *
 * @return {type}  promise
 */
function listTables() {
	return dynamodb.listTables({}).promise();
}

exports.listTables = listTables;
exports.backupTable = backupTable;
exports.printData = printData;
