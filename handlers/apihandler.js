const {readdirSync} = require("fs");

module.exports = function(__dirname=process.mainModule.path) {
  this.apis = [];

  this.reloadAPIs = function() {
    readdirSync(`${__dirname}/apis`).map(apiName => {
      let api = {};

      api.name = apiName;
      api.path = `${__dirname}/apis/`;

      this.apis.push(api);
    });
  }
  this.reloadAPIs();

  return this;
}