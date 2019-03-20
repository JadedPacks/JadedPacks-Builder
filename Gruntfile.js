'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		// Build the modpack
		buildZipClient: {
			compress: {
				archive: 'Client.zip'
				files: [
					{
						src: [
							'config/**'
						],
						dest: 'overrides/config/'
					}, {
						src: [
							'mods/**'
						],
						dest: 'overrides/mods/'
					},
					{
						src: [
							'manifest.json'
						]
					}
				]
			}
		},
		buildZipServer: {
			// TODO
		},
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadTasks('tasks');
	grunt.registerTask('build', [
		'buildZipClient',
		'buildZipServer'
	]);
	grunt.registerTask('test', [
		'yaml',
		'json',
		'cfg'
	]);
	grunt.registerTask('testdev', [
		'jshint',
		'jscs'
	]);
};