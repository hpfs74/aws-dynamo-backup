/**
 * getBackupTableName - create a formatted backup table name
 *
 * @param  {string} table the name of the table to backup
 * @param  {Date} backupDate the name of the table to backup
 * @return {string}       a string containing the orignal table name plus the time stamp
 */
function getBackupTableName(table, backupDate = new Date()) {
	const timestamp = backupDate
		.toISOString()
		.replace(/\..+/, '')
		.replace(/:/g, '')
		.replace(/-/g, '');

	return `${table}-${timestamp}`;
}

exports.getBackupTableName = getBackupTableName;
