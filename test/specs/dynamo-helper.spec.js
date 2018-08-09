const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('dynamohelper', () => {

	describe('printData', () => {
		it('should print the table name', () => {
			const logger = {
				log: sinon.spy(),
				error: sinon.spy()
			};

			/** @type {typeof import('../../src/dynamo-helper')} */
			const {printData} = proxyquire('../../src/dynamo-helper', {
				'./logger': logger
			});

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
				createBackup: sinon.stub().returns({
					promise: sinon.mock().resolves(true)
				})
			};

			awsStub = {
				DynamoDB: sinon.stub().returns(dynamodbstub),
				ResourceGroupsTaggingAPI: sinon.stub().returns(null)
			};
			// dynamodbstub.createBackup.yieldsAsync(null, {});

			
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
		let resourceapistub;
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

			resourceapistub = {
				getResources: sinon.stub()
			};

			awsStub = {
				DynamoDB: sinon.stub().returns(dynamodbstub),
				ResourceGroupsTaggingAPI: sinon.stub().returns(resourceapistub)
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
