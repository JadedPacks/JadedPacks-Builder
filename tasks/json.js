'use strict';

module.exports = function(grunt) {
	var jsonlint = require('jsonlint');

	grunt.registerMultiTask('json', 'Linting JSON', function() {
		var done = this.async();
		var options = this.options({
			force: false
		});
		var failed = 0;
		var passed = 0;
	    var force = options.force;
		delete options.force;

		// Hack into jsonlint's error handling
		var errorDetails = null;
		var originalParseError = jsonlint.parser.yy.parseError;
		jsonlint.parser.yy.parseError = function(str, hash) {
			grunt.log.error(str);
		};

		try {
			this.filesSrc.forEach(function(filepath) {
				if(grunt.file.isDir(filepath)) {
					return;
				}
				grunt.log.debug('Validating "' + filepath + '"...');
				var data = grunt.file.read(filepath);
				try {
					jsonlint.parse(data);
					grunt.verbose.ok(filepath + ' lint free.');
					passed++;
				} catch(e) {
					failed++;
				};
			});
		} finally {
			jsonlint.parser.yy.parseError = originalParseError;
		};

		if(failed > 0) {
			grunt.fail.warn(failed + ' ' + grunt.util.pluralize(failed, 'file/files') + ' failed validation');
		}
		grunt.log.ok(passed + ' ' + grunt.util.pluralize(passed, 'file/files') + ' lint free.');
		done(force ? true : passed);
	});
};