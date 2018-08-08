const expect = require('chai').expect;
const dateDiff = require('../../src/date-diff');

describe('date-diff', () => {
	describe('inDays', () => {
		it('should calculate diff in days with negative value', () => {
			const d1 = new Date('December 25 2018');
			const d2 = new Date('December 24 2018');

			const ret = dateDiff.inDays(d1, d2);

			expect(ret).to.equal(-1);
		});

		it('should calculate diff in days between to dates', () => {
			const d1 = new Date('December 24 2018');
			const d2 = new Date('December 25 2018');

			const ret = dateDiff.inDays(d1, d2);

			expect(ret).to.equal(1);
		});

		it('should return 0 if the same date', () => {
			const d1 = new Date('December 25 2018');
			const d2 = new Date('December 25 2018');

			const ret = dateDiff.inDays(d1, d2);

			expect(ret).to.equal(0);
		});
	});

	describe('inWeeks', () => {
		it('should return zero if days are in the same week', () => {
			const d1 = new Date('December 25 2018');
			const d2 = new Date('December 26 2018');

			const ret = dateDiff.inWeeks(d1, d2);

			expect(ret).to.equal(0);
		});

		it('should return positive difference if the date are a week away', () => {
			const d1 = new Date('December 25 2018');
			const d2 = new Date('January 1 2019');

			const ret = dateDiff.inWeeks(d1, d2);

			expect(ret).to.equal(1);
		});

		it('should return positive difference if the date are a week away', () => {
			const d2 = new Date('December 25 2018');
			const d1 = new Date('January 1 2019');

			const ret = dateDiff.inWeeks(d1, d2);

			expect(ret).to.equal(-1);
		});
	});
});
