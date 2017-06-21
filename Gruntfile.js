'use strict';

module.exports = function(grunt) {
	grunt.loadTasks('tasks');
	grunt.initConfig({
		// TODO: YAML parser required??
		yaml: {
			src: [
				'**/*.yaml',
				'!node_modules/**'
			]
		},
		// TODO: Better JSON parser (detect all errors in a document, not just first)
		// Possibly https://github.com/johngeorgewright/grunt-http/blob/master/tasks/http.js ?
		// https://jsonformatter.curiousconcept.com/
		json: {
			src: [
				'**/*.json',
				'!package.json',
				'!node_modules/**'
			]
		},
		cfg: {
			src: [
				'**/*.cfg',
				'!node_modules/**'
			]
		}
	});
	grunt.registerTask('test', [
		'yaml',
		'json',
		'cfg'
	]);
	grunt.option('force', true);
	grunt.registerTask('default', 'test');
};