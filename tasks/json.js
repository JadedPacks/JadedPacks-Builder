module.exports = function(grunt) {
	'use strict';

	var linter = require('jsonlint');

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
		linter.parser.yy.parseError = function(str) {
			grunt.log.error(str);
		};

		this.filesSrc.forEach(function(filepath) {
			if(grunt.file.isDir(filepath)) {
				return;
			}
			grunt.log.subhead('Validating "' + filepath + '"...');
			try {
				linter.parse(grunt.file.read(filepath));
				grunt.verbose.ok(filepath + ' lint free.');
				passed++;
			} catch(e) {
				failed++;
			}
		});

		if(failed > 0) {
			grunt.fail.warn(failed + ' ' + grunt.util.pluralize(failed, 'file/files') + ' failed validation');
		}
		grunt.log.ok(passed + ' ' + grunt.util.pluralize(passed, 'file/files') + ' lint free.');
		done(force ? true : passed);
	});
};