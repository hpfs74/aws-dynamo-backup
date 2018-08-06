const expect = require('chai').expect;
const getBackupTableName = require('../../src/serial-number')
	.getBackupTableName;

describe('serial-number', () => {
	describe('getBackupTableName', () => {
		it('should return a not empty table name', () => {
			const ret = getBackupTableName('test');

			expect(ret).not.to.be.empty;
			expect(ret).to.include('test');
		});

		it('should return a not empty table name', () => {
			const ret = getBackupTableName(
				'test',
				new Date('05 October 2011 14:48 UTC')
			);
			expect(ret).not.to.be.empty;
			expect(ret).to.equal('test-20111005T144800');
		});
	});
});
