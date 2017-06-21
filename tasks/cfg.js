'use strict';

module.exports = function(grunt) {
	var linter = require('./lint/cfg.js');

	grunt.registerMultiTask('cfg', 'Linting CFG', function() {
		var done = this.async();
		var options = this.options({
			force: false
		});
		var failed = 0;
		var passed = 0;
	    var force = options.force;
		delete options.force;

		this.filesSrc.forEach(function(filepath) {
			if(grunt.file.isDir(filepath)) {
				return;
			}
			grunt.log.debug('Validating "' + filepath + '"...');
			var data = grunt.file.read(filepath);
			try {
				linter.parse(data, options);
				grunt.verbose.ok(filepath + ' lint free.');
				passed++;
			} catch(e) {
				failed++;
			};
		});

		if(failed > 0) {
			grunt.fail.warn(failed + ' ' + grunt.util.pluralize(failed, 'file/files') + ' failed validation');
		}
		grunt.log.ok(passed + ' ' + grunt.util.pluralize(passed, 'file/files') + ' lint free.');
		done(force ? true : passed);
	});
};