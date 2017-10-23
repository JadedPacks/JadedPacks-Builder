module.exports = function(grunt) {
	'use strict';

	var linter = require('js-yaml');

	grunt.registerMultiTask('yaml', 'Linting YAML', function() {
		var done = this.async();
		var options = this.options({
			force: false,
			schema: linter.DEFAULT_SAFE_SCHEMA
		});
		var failed = 0;
		var passed = 0;
		var force = options.force;
		delete options.force;

		var skip = [];
		if(grunt.file.exists('ignore.txt')) {
			skip = grunt.file.read('ignore.txt').split("\n");
		}

		this.filesSrc.forEach(function(filepath) {
			if(grunt.file.isDir(filepath)) {
				return;
			}
			grunt.log.subhead('Validating "' + filepath + '"...');
			if(grunt.file.isMatch(skip, filepath)) {
				grunt.log.writeln('Skipped "' + filepath);
			} else {
				try {
					linter.load(grunt.file.read(filepath), Object.assign(options, {'filename': filepath}));
					grunt.verbose.ok(filepath + ' lint free.');
					passed++;
				} catch(e) {
					failed++;
					grunt.log.error(e);
				}
			}
		});

		if(failed > 0) {
			grunt.fail.warn(failed + ' ' + grunt.util.pluralize(failed, 'file/files') + ' failed validation');
		}
		grunt.log.ok(passed + ' ' + grunt.util.pluralize(passed, 'file/files') + ' lint free.');
		done(force ? true : passed);
	});
};