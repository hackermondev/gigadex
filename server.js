const {readdirSync, readFileSync, existsSync} = require("fs");
const app = require("express")();
const port = 3000;

let apps = [];
// let apis = [];

// Find All Apps
function findApps() {
  apps = [];

  readdirSync(`${__dirname}/apps`).map(appName => {
    let appPath = `${__dirname}/apps/${appName}`;

    if(existsSync(`${appPath}/metadata.json`)) {
      let appMeta = JSON.parse(readFileSync(`${appPath}/metadata.json`).toString());
      appMeta.path = appPath;

      if(appMeta.name && appMeta.main && appMeta.author) apps.push(appMeta);
    }
  });
}
findApps();

// Find All APIS
// function findAPIs() {
//   apis = [];

//   readdirSync(`${__dirname}/apis`).map(apiName => {
//     let apiPath = `${__dirname}/apis/${apiName}`;
//     apis.push({name: apiName.split(".")[0], path: apiPath, api: require(`${apiPath}`)(__dirname)});
//   });
// }
// findAPIs();

// console.log(apps);
// console.log(apis);

// App Main
app.get("/:appName", (req, res) => {
  const app = apps.find(app => app.name.toLowerCase() === req.params.appName.toLowerCase());
  if(app) res.sendFile(`${app.path}/${app.main}`);
  else res.status(404);
});

// App Files
app.get("/:appName/*", (req, res) => {
  const app = apps.find(app => app.name.toLowerCase() === req.params.appName.toLowerCase());
  
  if(app) {
    if(existsSync(`${__dirname}/apps/${req.path}`)) res.sendFile(`${__dirname}/apps${req.path}`);
    else if(existsSync(`${__dirname}/apis/${req.path.split("/").pop()}`)) res.sendFile(`${__dirname}/apis/${req.path.split("/").pop()}`);
    else res.status(404);

    // console.log(`${__dirname}/apps/${req.path}`);
    // console.log(`${__dirname}/apis/${req.path.split("/").pop()}`);
  }
  else res.status(404);
});

// Run Server
app.listen(port, console.log(`Running on *:${port}`));