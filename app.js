const fs = require('fs');
const bodyParser = require('body-parser');
// const ejs = require('ejs');

const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io').listen(http);
const port = 3000;

let appsFolder = "apps/";
let apps = [];

// App Metadata
function updateApps(verbose=false) {
  apps = [];

  fs.readdirSync(appsFolder).map(appDir => {
    let appPath = `${appsFolder}${appDir}/`;
    try {
      let metadata = JSON.parse(fs.readFileSync(appPath + "metadata.json").toString());
      
      if((metadata.name || metadata.main || metadata.author)) {
        metadata.path = appPath;
        metadata.main = appPath + metadata.main;

        if(metadata.icon) metadata.icon = appPath + metadata.icon;

        apps.push(metadata);
      }
      else throw undefined;
    }
    catch {
      if(verbose) console.log(appPath + "metadata.json");
    }
  });
}

updateApps();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
// app.set('view-engine', 'ejs');

// app.use((req, res, next) => { // defaults for ejs code
// 	res.locals.title = null;
// 	res.locals.content = null;
// 	res.locals.message = null;
// 	res.locals.apps = apps;
// 	next();
// });

// Home
app.get('/', (req, res) => {
	res.redirect('/app/home');
});

// Icons
app.get('/icon/:appName', (req, res) => {
  let appName = req.params.appName;
  let app = apps.filter(app => app.name === appName)[0];

  if(app && app.icon) return res.sendFile(__dirname + "/" + app.icon);
  return res.sendFile(__dirname + "/assets/icons/unknown.png");
});

// App Main
app.get('/app/:appName', (req, res) => {
  let appName = req.params.appName;
  let app = apps.filter(app => app.name === appName)[0];

  if(app) return res.sendFile(__dirname + "/" + app.main);
  return res.status(404);
});

// App Files
app.get('/app/:appName/*', (req, res) => {
  let appName = req.params.appName;
  let filePath = req.path.replace(`/app/${appName}/`, "");
  let app = apps.filter(app => app.name === appName)[0];

  if(app) return res.sendFile(__dirname + "/" + app.path + filePath);
  return res.status(404);
});

// Listen
http.listen(port, console.log(`Server started on *:${port}`));

// GUI
nw.Window.open(`localhost:${port}`);