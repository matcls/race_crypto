require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const socketIO = require("socket.io");

const app = express();

const server = app.listen(PORT, () => {
  console.log(`Listining to ${PORT}`);
});

const socketHandler = socketIO(server);

socketHandler.on("connection", (socket) => {
  socket.on("connect_error", () => {
    console.log("Connection error!");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected!");
  });
  console.log("Client Connected!");
  socket.emit("Hello RACE Client!");
});
