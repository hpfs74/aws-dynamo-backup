const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();
const logger = require('./logger');

exports.handler = (event, context, callback) => {
    console.log('Received event', event);
    // var tablesToBackup = event.tablesToBackup.split(",");
    // var promises = tablesToBackup.map(backupTable);
    dynamodb.listTables({}, function(err, AllTables) {
      if (err) console.log(err, err.stack);
      else    {
        console.log("\n\n" + AllTables['TableNames'] + "\n\n");
        for (var item in AllTables['TableNames']) {
          PrintData(AllTables['TableNames'][item]);
          backupTable(AllTables['TableNames'][item]);
        }
      }
    });
    // Promise.all(promises)
    //   .then(result => { console.log(result); callback(); })
    //   .catch(reason => { console.log(reason); callback(reason); });
};

function PrintData(tablename) {
  console.log("data: " + tablename);
}

function backupTable(tablename) {
  var timestamp = new Date().toISOString()
    .replace(/\..+/, '')
    .replace(/:/g, '')
    .replace(/-/g, '');

  var params = {
    TableName: tablename,
    BackupName: tablename + timestamp
  };
  console.log(params);
  return dynamodb.createBackup(params).promise();
}
