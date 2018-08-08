const logger = require('./logger');
const getBackupTableName = require('./serial-number').getBackupTableName;
const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();
const tags = new aws.ResourceGroupsTaggingAPI();
const dateDiff = require('./date-diff');

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

	return new Promise((resolve, reject) => {
		logger.log(params);
		dynamodb.createBackup(params, (err, data) => {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

/**
 * listTables - return the list of all the dynamodb tables in the current role.
 *
 * @return {type}  promise
 */
function listTables() {
	return new Promise((resolve, reject) => {
		dynamodb.listTables({}, (err, data) => {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

/**
 * stripTableNameFromARN - get the table name from a arn of dynamodb
 *
 * @param  {type} arn description
 * @return {type}     description
 */
function stripTableNameFromArn(arn) {
	if (!arn) {
		return '';
	}

	const arnSplit = arn.split(':');

	// check if it is a dynamodb related arn
	if (arnSplit[2] !== 'dynamodb') {
		return '';
	}

	return arnSplit[5].split('/')[1];
}

/**
 * getBackupHistoryDay - get how many days to backup from tags
 *
 * @param  {type} resource                    the resource
 * @param  {type} tagKey = 'BackupHistoryDay' the tag name
 * @return {type}                             an integer with the days to mantain backup default is 30
 */
function getBackupHistoryDay(resource, tagKey = 'BackupHistoryDay') {
	let backupHistoryDay = 30;

	if (resource && resource.Tags) {
		let daysTag = resource.Tags.filter(tag => tag.Key === tagKey);

		if (daysTag.length > 0) {
			backupHistoryDay = daysTag[0].Value;
		}
	}

	return backupHistoryDay;
}

/**
 * listTablesToBackup - get the list of table to backup based on tag
 *
 * @param  {type} key = 'knab-dynamo-backup' the tag name to filter
 * @param  {type} value = 'true'             the value of the tag
 *
 * @return {type}  an array that contains table name and tags
 * @throws 				 an aws exception in case not able to access resource
 */
async function listTablesToBackup(key = 'knab-dynamo-backup', value = 'true') {
	const params = {
		PaginationToken: '',
		ResourceTypeFilters: ['dynamodb'],
		ResourcesPerPage: 50,
		TagFilters: [
			{
				Key: key,
				Values: [value]
			}
		]
	};

	let result = [];
	let ret = await tags.getResources(params).promise();

	result = result.concat(ret.ResourceTagMappingList);

	while (ret.PaginationToken) {
		params.PaginationToken = ret.PaginationToken;
		ret = await tags.getResources(params).promise();
		result = result.concat(ret.ResourceTagMappingList);
	}

	return result;
}

/**
 * maintenancePlan - run a maintenance on backup to remove the oldest
 *
 * @param  {type} table table name to maintain
 * @param  {type} days  number of days to keep
 * @throws 							aws expection
 */
async function maintenancePlan(table, days) {
	const backups = await dynamodb
		.listBackups({
			Limit: 50,
			TableName: table
		})
		.promise();

	const now = new Date();
	for (let backup in backups) {
		if (dateDiff.inDays(backup.BackupCreationDateTime, now) > days) {
			await dynamodb
				.deleteBackup({
					BackupArn: backup.BackupARN
				})
				.promise();
		}
	}
}

exports.getBackupHistoryDay = getBackupHistoryDay;
exports.stripTableNameFromArn = stripTableNameFromArn;
exports.listTablesToBackup = listTablesToBackup;
exports.listTables = listTables;
exports.backupTable = backupTable;
exports.printData = printData;
exports.maintenancePlan = maintenancePlan;
