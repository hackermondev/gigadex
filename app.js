const os = require("./os.js");

function openApp(path) {
  nw.Window.open(path);
}

nw.Window.open("/public/views/index.html");