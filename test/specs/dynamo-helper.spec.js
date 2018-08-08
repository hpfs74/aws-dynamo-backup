const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('dynamohelper', () => {
	describe('listTables', () => {});

	describe('printData', () => {
		it('should print the table name', () => {
			const logger = {
				log: sinon.spy(),
				error: sinon.spy()
			};
			const printData = proxyquire('../../src/dynamo-helper', {
				'./logger': logger
			}).printData;

			printData('test-table');

			expect(logger.log.calledOnce).to.be.true;
		});
	});

	describe('backupTable', () => {
		let backupTable;
		let dynamodbstub;
		let awsStub;
		let logger;

		beforeEach(() => {
			logger = {
				log: sinon.spy(),
				error: sinon.spy()
			};
			dynamodbstub = {
				createBackup: sinon.stub()
			};

			awsStub = {
				DynamoDB: sinon.stub().returns(dynamodbstub)
			};
			dynamodbstub.createBackup.yieldsAsync(null, {});

			backupTable = proxyquire('../../src/dynamo-helper', {
				'aws-sdk': awsStub,
				'./logger': logger
			}).backupTable;
		});

		it('should log backup data', done => {
			backupTable('test-table').then(() => {
				expect(logger.log.calledOnce).to.be.true;
				done();
			});
		});

		it('should run backup on correct object', done => {
			backupTable('test-table').then(() => {
				done();
			});
		});
	});

	describe('listTables', () => {
		let listTables;
		let dynamodbstub;
		let awsStub;
		let logger;

		beforeEach(() => {
			logger = {
				log: sinon.spy(),
				error: sinon.spy()
			};
			dynamodbstub = {
				listTables: sinon.stub()
			};

			awsStub = {
				DynamoDB: sinon.stub().returns(dynamodbstub)
			};
			dynamodbstub.listTables.yieldsAsync(null, [
				{ item: 'a' },
				{ item: 'b' },
				{ item: 'c' }
			]);

			listTables = proxyquire('../../src/dynamo-helper', {
				'aws-sdk': awsStub,
				'./logger': logger
			}).listTables;
		});

		it('should return the list of all available table', done => {
			listTables()
				.then(data => {
					expect(data.length).to.equal(3);
					done();
				})
				.catch(err => done(err));
		});
	});
});
