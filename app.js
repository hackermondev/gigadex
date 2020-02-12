const {readdirSync, existsSync} = require("fs");

const apiHandler = require("./handlers/apihandler.js")();
const appHandler = require("./handlers/apphandler.js")();

console.log(apiHandler.apis);
console.log(appHandler.apps);

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

app.listen(process.env.PORT | 3000, console.log(`Server started on *:${process.env.PORT | 3000}`));