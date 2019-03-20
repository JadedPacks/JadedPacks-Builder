module.exports = function(grunt) {
	'use strict';

	var fs = require('fs'),
		archiver = require('archiver');

	grunt.registerMultiTask('compress', 'Compress files', function() {
		var done = this.async(),
			archive = archiver.create('zip'),
			dest = exports.archive;
		grunt.file.mkdir(path.dirname(dest));
		var destStream = fs.createWriteStream(dest);
		archive.on('error', function(err) {
			grunt.log.error(err);
			grunt.fail.warn('Compressing failed.');
		});
		destStream.on('error', function(err) {
			grunt.log.error(err);
			grunt.fail.warn('WriteStream failed.');
		});
		destStream.on('close', function() {
			done();
		});
		archive.pipe(destStream);
		this.files.forEach(function(file) {
			file.src.forEach(function(srcFile) {
				var fstat = fileStatSync(srcFile);
				if(!fstat) {
					grunt.fail.warn('Unable to stat srcFile (' + srcFile + ')');
					return;
				}
				var internalFileName = file.dest
				if(fstat.isDirectory() && internalFileName.slice(-1) !== '/') {
					srcFile += '/';
					internalFileName += '/';
				}
				var fileData = {
					name: internalFileName,
					stats: fstat
				};
				if(fstat.isFile()) {
					archive.file(srcFile, fileData);
				} else if(fstat.isDirectory()) {
					archive.append(null, fileData);
				} else {
					grunt.fail.warn('srcFile (' + srcFile + ') should be a valid file or directory.');
					return;
				}
			});
		});
		grunt.log.ok('Compressed ' + files.length + ' ' + grunt.util.pluralize(files.length, 'file/files.'));
		archive.finalize();
	});
};