
/**
 * getBackupTableName - create a formatted backup table name
 *
 * @param  {type} table the name of the table to backup
 * @return {type}       a string containing the orignal table name plus the time stamp
 */
function getBackupTableName(table) {
  var timestamp = new Date().toISOString()
    .replace(/\..+/, '')
    .replace(/:/g, '')
    .replace(/-/g, '');

  return `${table}-${timestap}`;
}

exports.getBackupTableName = getBackupTableName;
