module.exports = function(wallaby) {
	return {
		files: ['src/**/*.js', 'test/mocks/NI_saubc_DATA_DETAIL.xml'],
		tests: ['test/**/*.spec.js', { pattern: 'test/mocks/NI_saubc_DATA_DETAIL.xml', instrument: false}],
		compilers: {
			'src/**/*.js': wallaby.compilers.babel({
				presets: ['es2017'],
				plugins: ['transform-object-rest-spread']
			})
		},
		testFramework: 'mocha',
		env: {
			type: 'node'
		}
	};
};
