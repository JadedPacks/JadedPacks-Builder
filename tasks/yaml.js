'use strict';

module.exports = function(grunt) {
	var yaml = require('js-yaml');

	grunt.registerMultiTask('yaml', 'Linting YAML', function() {
		var done = this.async();
		var options = this.options({
			force: false,
			schema: yaml.DEFAULT_SAFE_SCHEMA
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
			options.filename = filepath;
			try {
				yaml.load(data, options);
				grunt.verbose.ok(file + ' lint free.');
				passed++;
			} catch(e) {
				failed++;
				grunt.log.error(e);
			}
			delete options.filename;
		});

		if(failed > 0) {
			grunt.fail.warn(failed + ' ' + grunt.util.pluralize(failed, 'file/files') + ' failed validation');
		}
		grunt.log.ok(passed + ' ' + grunt.util.pluralize(passed, 'file/files') + ' lint free.');
		done(force ? true : passed);
	});
};