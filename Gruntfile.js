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
		yaml: {
			src: [
				'**/*.yaml',
				'!node_modules/**'
			]
		},
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