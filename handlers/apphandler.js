const {readdirSync, existsSync} = require("fs");

module.exports = function(__dirname=process.mainModule.path) {
  this.apps = [];

  this.reloadApps = function() {
    readdirSync(`${__dirname}/apps`).map(appName => {
      let app = require(`${__dirname}/apps/${appName}/metadata.json`);
      app.path = `${__dirname}/apps/${appName}/`;

      if(!app.name || !app.main || !app.author) return;

      this.apps.push(app);
    });
  }
  this.reloadApps();

  return this;
}