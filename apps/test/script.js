const socket = io();

socket.emit("load", "test");

socket.emit("use", {name: "test", do: [["msg", "Vandesm14"]]});
socket.on("use", data => console.log(data));

socket.emit("unload", "test");