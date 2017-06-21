'use strict';

module.exports = function(grunt) {
	grunt.loadTasks('tasks');
	grunt.initConfig({
		// TODO: YAML parser required??
		yaml: {
			src: [
				'**/*.yaml',
				'!package.json',
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
		// TODO: cfg parser: https://github.com/MinecraftForge/MinecraftForge/blob/1.7.10/src/main/java/net/minecraftforge/common/config/Configuration.java#L791
		cfg: {
			src: [
				'**/*.cfg',
				'!package.json',
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