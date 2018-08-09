const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('Lambda handler', () => {
	describe('index', () => {
		/** @type {typeof import('../../src/dynamo-helper')} */
		let dHelper;
		let dynamoDBStub;
		let resourceAPIStub;
		let awsStub;
		let logger;
		/** @type {typeof import('../../src/index')} */
		let index;

		const testData = {
			resources: {
				PaginationToken: null,
				ResourceTagMappingList: [
					{
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table1',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table2',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table3',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table4',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table5',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table6',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table7',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}, {
						ResourceARN: 'arn:partition:dynamodb:region:account-id:resourcetype/Table8',
						Tags: [{ Key: 'knab-dynamo-backup', Value: 'true' }, { Key: 'BackupHistoryDay', Value: '30' }]
					}
				]

			},
			tableList: [
				{
					tableName: 'Table1',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table2',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table3',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table4',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table5',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table6',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table7',
					backupHistoryDay: '30'
				}, {
					tableName: 'Table8',
					backupHistoryDay: '30'
				}
			]
		};

		before(() => {
			logger = {
				log: sinon.spy(),
				error: sinon.spy()
			};

			dynamoDBStub = {
				listTables: sinon.stub(),
				createBackup: sinon.stub().returns({
					promise: sinon.stub().resolves(true)
				}),
				listBackups: sinon.stub().returns({
					promise: sinon.stub().resolves({ BackupSummaries: [] })
				})
			};

			resourceAPIStub = {
				getResources: sinon.stub().returns({
					promise: sinon.stub().resolves(testData.resources)
				})
			};

			awsStub = {
				DynamoDB: sinon.stub().returns(dynamoDBStub),
				ResourceGroupsTaggingAPI: sinon.stub().returns(resourceAPIStub)
			};

			dynamoDBStub.listTables.yieldsAsync(null, [
				{ item: 'a' },
				{ item: 'b' },
				{ item: 'c' }
			]);

			dHelper = proxyquire('../../src/dynamo-helper', {
				'aws-sdk': awsStub,
				'./logger': logger
			});

			index = proxyquire('../../src/index', {
				'./dynamo-helper': dHelper,
				'./logger': logger
			});
		});

		it('should collect all available tables', () => {
			return index.genProcessedTableList().then((data) => {
				let test = Array.from(data);
				expect(test.length).to.equal(testData.resources.ResourceTagMappingList.length);
				expect(test).to.be.deep.equal(testData.tableList);
			});
		});

		it('should create chain of promises to run backup', () => {
			const test = index.getPromises(testData.tableList);
			expect(test.length).to.be.equal(testData.tableList.length);
			expect(test.filter(p => !(p instanceof Promise)).length).to.be.equal(0);
		});

		it('should call callback with no error if success', (done) => {
			const test = sinon.spy();
			index.handler(null, null, test).then(() => {
				expect(test.called).to.be.true;
				expect(test.getCall(0).args.length).to.be.equal(0);
				done();
			});
		});

		it('should call callback with error if any', (done) => {
			const test = sinon.spy();
			resourceAPIStub.getResources = sinon.stub().returns({
				promise: sinon.stub().rejects(new Error('booom'))
			});
			const cb = () => {
				expect(test.called).to.be.true;
				expect(test.firstCall.args.length).to.be.greaterThan(0);
				expect(test.firstCall.args[0].message).to.be.equal('booom');
				done();
			};
			index.handler(null, null, test).then(cb);
		});
	});
});
