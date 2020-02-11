const fs = require('fs');

class App {
	constructor(name) {
		this.name = name;
		app = {
			install: function() {},
			uninstall: function() {},
			open: function() {},
			info: function() {},
			update: function() {},
			restart: function() {}
		};
		database = {
			setItem: function() {
				fs.writeFileSync();
			},
			getItem: function() {}
		};
		settings = {
			defaultApp: function() {},
			timeFormat: function() {},
			taskbar: {
				position: function() {},
				autohide: function() {},
				layout: function() {}
			},
			setTimeZone: function() {}
		};
		users = {
			add: function() {},
			remove: function() {},
			check: function() {},
			login: function() {},
			admin: function() {}
		};
	}
}

module.exports = os;