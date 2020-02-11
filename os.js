const fs = require('fs');

class App {
	constructor(name) {
		this.name = name;
		this.path = 'apps/' + this.name;
		this.app = {
			install: function() {},
			uninstall: function() {},
			open: function() {},
			info: function() {},
			update: function() {},
			restart: function() {}
		};
		this.database = {
			setItem: function(key, value) {
				fs.writeFileSync(`${this.path}/.db/${key}`, JSON.stringify(value), 'utf8');
			},
			getItem: function(key) {
				let json = fs.readFileSync(`${this.path}/.db/${key}`, 'utf8');
				return JSON.parse(json);
			}
		};
		this.settings = {
			defaultApp: function() {},
			timeFormat: function() {},
			taskbar: {
				position: function() {},
				autohide: function() {},
				layout: function() {}
			},
			setTimeZone: function() {}
		};
		this.users = {
			add: function() {},
			remove: function() {},
			check: function() {},
			login: function() {},
			admin: function() {}
		};
	}
}

module.exports = App;