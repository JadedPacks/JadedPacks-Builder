exports.init = function(grunt) {
	'use strict';

	var linter = {
		didError: false,
		lineNum: 0,
		data: null,
		error: function(message) {
			grunt.log.error('Parse error on line ' + this.lineNum + ":\n" + this.data[this.lineNum] + "\n" + message);
			grunt.log.writeln("");
			this.didError = true;
		},
		parse: function(data, options) {
			options = options || {};
			data = data.split("\n");
			this.data = data;
			var i,
				line = null,
				currentCat = null,
				type = null,
				tmpList = null,
				name = null,
				categories = {},
				categoriesParents = {};
			for(this.lineNum = 0; this.lineNum < data.length; this.lineNum++) {
				line = data[this.lineNum];
				var nameStart = -1,
					nameEnd = -1,
					skip = false,
					quoted = false,
					isFirstNonWhitespaceCharOnLine = true,
					lineSplit = line.split("");
				for(i = 0; i < lineSplit.length && !skip; i++) {
					var ch = lineSplit[i];
					if(/[a-z0-9._-]/i.test(ch) || (quoted && ch !== '"')) {
						if(nameStart === -1) {
							nameStart = i;
						}
						nameEnd = i;
						isFirstNonWhitespaceCharOnLine = false;
					} else if(/\s/.test(ch)) {
						// Ignore space characters
					} else {
						switch(ch) {
							case '#':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								skip = true;
								continue;
							case '"':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								if(quoted) {
									quoted = false;
								}
								if(!quoted && nameStart === -1) {
									quoted = true;
								}
								break;
							case '{':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								name = line.substring(nameStart, nameEnd + 1);
								var qualifiedName = name;
								if(currentCat !== null) {
									qualifiedName = currentCat + "." + name;
									categoriesParents[qualifiedName] = currentCat;
								}
								if(!(qualifiedName in categories)) {
									currentCat = name;
									categories[qualifiedName] = currentCat;
								} else {
									currentCat = categories[qualifiedName];
								}
								name = null;
								break;
							case '}':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								if(currentCat === null) {
									this.error('Config file corrupt, attempted to close too many categories');
								}
								currentCat = categoriesParents[currentCat];
								break;
							case '=':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								name = line.substring(nameStart, nameEnd + 1);
								if(currentCat === null) {
									this.error(name + ' has no scope.');
								}
								// Check to make sure property is the correct type
								var prop = line.substring(i + 1);
								switch(type) {
									case 'B':
										if(!(/^\s?true|false(\s+)?$/i.test(prop))) {
											this.error('Property is not a correct boolean.');
										}
										break;
									case 'I':
										if(!(/^\s?[0-9-]+(\s+)?$/.test(prop))) {
											this.error('Property is not a correct integer.');
										}
										break;
									case 'D':
										if(!(/^\s?[0-9-]+(\.[0-9E-]+)?(\s+)?$/.test(prop))) {
											this.error('Property is not a correct double.');
										}
										break;
									case 'S':
									case null:
										// Everything is a correct string, in Forge's view.
										break;
									default:
										this.error('Unknown property type ' + type);
								}
								i = lineSplit.length;
								break;
							case ':':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								type = line.substring(nameStart, nameEnd + 1).charAt(0);
								nameStart = nameEnd = -1;
								break;
							case '<':
								if((tmpList !== null && i + 1 === lineSplit.length) || (tmpList === null && i + 1 !== lineSplit.length)) {
									this.error('Malformed list property');
								} else if(i + 1 === lineSplit.length) {
									name = line.substring(nameStart, nameEnd + 1);
									if(currentCat === null) {
										this.error(name + ' has no scope');
									}
									tmpList = [];
									skip = true;
								}
								break;
							case '>':
								if(tmpList === null) {
									this.error('Malformed list property');
								}
								if(isFirstNonWhitespaceCharOnLine) {
									name = null;
									tmpList = null;
									type = null;
								}
								// else allow special characters as part of string lists
								break;
							case '~':
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								// Do we even need to parse versions? o.O
								if(line.startsWith('~CONFIG_VERSION')) {
									skip = true;
								}
								break;
							default:
								// Allow special characters as part of string lists
								if(tmpList !== null) {
									break;
								}
								this.error('Unknown character "' + ch + '"');
						}
						isFirstNonWhitespaceCharOnLine = false;
					}
				}
			}
			if(this.didError) {
				throw new Error();
			}
		}
	};
	return linter;
};