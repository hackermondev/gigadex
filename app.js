/* app */
const app = require("express")();
const http = require("http").createServer(app).listen(process.env.PORT | 3000, console.log(`Server started on *:${process.env.PORT | 3000}`));

const {existsSync} = require("fs");

// gets apps main
app.get("/app/:name/", (req, res) => {
  let path = `${__dirname}/apps/${req.params.name}`; // app path

  if(existsSync(`${__dirname}/apps/${req.params.name}/properties.json`)) prop = require(`${__dirname}/apps/${req.params.name}/properties.json`); // app properties loaded
  else return res.status(404); // app properties not found

  if(existsSync(path)) return res.sendFile(`${path}/${prop.load}`); // apps main sent
  else return res.status(404); // apps main not found
});

// gets apps files
app.get("/app/:name/*", (req, res) => {
  let path = `${__dirname}/apps/${req.params.name}/${req.path.replace(`/app/${req.params.name}/`, "")}`; // files path

  if(existsSync(path)) return res.sendFile(path); // send apps file
  else return res.status(404);
});

/* api */
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.apis = {};

  // loads api
  socket.on("load", name => {
    let path = `${__dirname}/apis/${name}.js`; // api path

    if(existsSync(path)) {
      socket.apis[name] =  require(path); // load/reload api
      return socket.emit("load", true); // api loaded
    }
    else return socket.emit("load", false); // api not loaded
  });

  // uses api
  socket.on("use", event => {
    if(!event.name || !event.do) return socket.emit("use", false); // event not setup correct
    else if(socket.apis[event.name]) {
      try {
        // each task to do
        for(let task of event.do) {
          // console.log(socket.apis[event.name][task[0]](...task.splice(1, task.length-1)));
          socket.emit("use", socket.apis[event.name][task[0]](...task.splice(1, task.length-1))); // use api
        }
      }
      catch {
        socket.emit("use", false); // error using api
      }
    }
    else return socket.emit("use", false); // api not loaded
  });

  // unloads api
  socket.on("unload", name => {
    // api is loaded
    if(socket.apis[name]) {
      delete socket.apis[name]; // remove loaded api
      return socket.emit("unload", true); // api unloaded
    }
    else return socket.emit("unload", false); // api not loaded
  });
});