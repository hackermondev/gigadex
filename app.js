const {readdirSync, existsSync} = require("fs");

let apis = [];
let apps = [];

function reloadAPIs() {
  readdirSync(`${__dirname}/apis`).map(apiName => {
    let api = {};

    api.name = apiName;
    api.path = `${__dirname}/apis/`;

    apis.push(api);
  });
}
reloadAPIs();

function reloadApps() {
  readdirSync(`${__dirname}/apps`).map(appName => {
    let app = require(`${__dirname}/apps/${appName}/metadata.json`);
    app.path = `${__dirname}/apps/${appName}/`;

    if(!app.name || !app.main || !app.author) return;

    apps.push(app);
  });
}
reloadApps();

console.log(apis);
console.log(apps);

const app = require("express")();

app.get("/:appName", (req, res) => {
  const appName = req.params.appName;
  const app = apps.find(app_ => app_.name.toLowerCase() === appName.toLowerCase());

  if(app) res.sendFile(`${app.path}/${app.main}`);
  else res.status(404);
});

app.get("/:appName/*", (req, res) => {
  if(existsSync(`${__dirname}/apps${req.path}`)) res.sendFile(`${__dirname}/apps${req.path}`);
  else res.status(404);
});

app.listen(3000, console.log("Server started on *:3000"));