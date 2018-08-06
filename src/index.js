const logger = require('./logger');
const dynamoHelper = require('./dynamo-helper');

exports.handler = (event, context, callback) => {
	logger.log('Received event', event);
	let promises = [];
	dynamoHelper
		.listTables()
		.then(data => {
			promises = data['AllTables'].map(table =>
				dynamoHelper.backupTable(table)
			);
		})
		.catch(err => {
			callback(new Error('Unable to retrieve tables. ' + err.message));
		});

	// fullfill all the promises
	Promise.all(promises)
		.then(() => callback())
		.catch(err => callback(err));
};
