function inDays(d1, d2) {
	const t2 = d2.getTime();
	const t1 = d1.getTime();

	return Math.ceil((t2 - t1) / (24 * 3600 * 1000));
}

function inWeeks(d1, d2) {
	const t2 = d2.getTime();
	const t1 = d1.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
}

function inMonths(d1, d2) {
	const d1Y = d1.getFullYear();
	const d2Y = d2.getFullYear();
	const d1M = d1.getMonth();
	const d2M = d2.getMonth();

	return d2M + 12 * d2Y - (d1M + 12 * d1Y);
}

function inYears(d1, d2) {
	return d2.getFullYear() - d1.getFullYear();
}

module.exports.inYears = inYears;
module.exports.inMonths = inMonths;
module.exports.inWeeks = inWeeks;
module.exports.inDays = inDays;
