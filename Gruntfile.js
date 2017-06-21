'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadTasks('tasks');
	grunt.initConfig({
		// Test our own grunt tasks
		jshint: {
			options: {
				jshintrc: true
			},
			all: [
				'tasks/**.js',
				'Gruntfile.js'
			]
		},
		jscs: {
			src: '<%= jshint.all %>'
		},
		// And finally, test the modpack
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
	grunt.registerTask('testdev', [
		'jshint',
		'jscs'
	]);
	grunt.option('force', true);
	grunt.registerTask('default', 'test');
};