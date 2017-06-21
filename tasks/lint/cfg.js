'use strict';

(function() {
	var error = function(message) {
		grunt.log.error(message);
	};

	var parse = function(data, options = {}) {
		data = data.split("\n");
		var lineNum, i,
			line = null,
			currentCat = null,
			type = null,
			tmpList = null,
			name = null,
			categories = {},
			categoriesParents = {};
		for(lineNum = 0; lineNum < data.length; lineNum++) {
			line = data[lineNum];
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
				}
				if(/\s/.test(ch)) {
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
							if(tmpList != null) {
								break;
							}
							if(quoted) {
								quoted = false;
							}
							if(!quoted && nameStart == -1) {
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
								currentCat = categories[qualifiedName]
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
							i = lineSplit.length;
							// Check to make sure property is the correct type
							var prop = line.substring(i + 1);
							switch(type) {
								case 'B':
									if(!(/^true|false$/i.test(prop))) {
										this.error('Property is not a correct boolean.');
									}
									break;
								case 'I':
									if(!(/^[0-9-]+$/.test(prop))) {
										this.error('Property is not a correct integer.');
									}
									break;
								case 'D':
									if(!(/^[0-9-]+\.[0-9E-]+$/.test(prop))) {
										this.error('Property is not a correct double.');
									}
									break;
								case 'S':
									if((quoted && !(/^[a-z]+"$/i.test(prop))) || (!quoted && !(/^[a-z]+$/i.test(prop)))) {
										this.error('Property is not a correct integer.');
									}
									break;
								default:
									this.error('Unknown property type ' + type);
							}
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
	}
	return this;
})();