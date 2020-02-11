const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 3000;

const fs = require('fs');

let appsFolder = "apps/";
let apps = [];

// App Metadata
function updateApps(verbose = false) {
	apps = [];

	fs.readdirSync(appsFolder).map(appDir => {
		let appPath = `${appsFolder}${appDir}/`;
		try {
			let metadata = JSON.parse(fs.readFileSync(appPath + "metadata.json").toString());

			if ((metadata.name || metadata.main || metadata.author)) {
				metadata.path = appPath;
				metadata.main = appPath + metadata.main;

				if (metadata.icon) metadata.icon = appPath + metadata.icon;

				apps.push(metadata);
			} else throw undefined;
		} catch {
			if (verbose) console.log(appPath + "metadata.json");
		}
	});
}
updateApps();

// Find App
function findApp(appName) {
	return apps.find(app => {
		return app.name.toLowerCase() === appName.toLowerCase();
	});
}

// Run App
function runApp(appName) {
	let app = findApp(appName);

	let uuid = (function () {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == "x" ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	})();

	// fs.mkdirSync(__dirname + "/running/" + uuid);

	let walkSync = function (dir, filelist = []) {
		let files = fs.readdirSync(dir);

		files.forEach(function (file) {
			if (fs.statSync(dir + "/" + file).isDirectory()) {
				filelist = walkSync(dir + file + '/', filelist);
			} else {
				filelist.push(file);
			}
		});
		return filelist;
	};

	let files = walkSync(__dirname + "/" + app.path);
	console.log(files);
}

runApp("File Viewer");

// Home
app.get('/', (req, res) => {
	res.redirect('/app/home');
});

// Icons
app.get('/icon/:appName', (req, res) => {
	let appName = req.params.appName;
	let app = findApp(appName);

	if (app && app.icon) return res.sendFile(__dirname + "/" + app.icon);
	return res.sendFile(__dirname + "/assets/icons/unknown.png");
});

// App Main
app.get('/app/:appName', (req, res) => {
	let appName = req.params.appName;
	let app = findApp(appName);

	if (app) return res.sendFile(__dirname + "/" + app.main);
	return res.status(404);
});

// App Files
app.get('/app/:appName/*', (req, res) => {
	let appName = req.params.appName;
	let filePath = req.path.replace(`/app/${appName}/`, "");
	let app = findApp(appName);

	if (app) return res.sendFile(__dirname + "/" + app.path + filePath);
	return res.status(404);
});

// App Data
app.get("/appdata/:appName", (req, res) => {
	let appName = req.params.appName;
	let app = findApp(appName);

	res.setHeader("Content-Type", "application/json");

	if (app) return res.json(app);
	return res.status(404);
});

// Listen
http.listen(port, console.log(`Server started on *:${port}`));

// GUI
// nw.Window.open(`localhost:${port}`); // Still not working