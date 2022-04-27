require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");

const server = express().listen(PORT, () => {
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
  socket.emit("crypto", "Connected to RACE!");
});

const getPrices = () => {
  axios
    .get(process.env.LIST_URL, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
    .then((response) => {
      const priceList = response.data.data.map((item) => {
        return {
          id: item.id,
          name: item.symbol,
          price: item.metrics.market_data.price_usd,
        };
      });

      socketHandler.emit("crypto", priceList);
    })
    .catch((err) => {
      console.log(err);
      socketHandler.emit("crypto", {
        error: true,
        message: "Error Fetching Prices Data From API",
      });
    });
};

setInterval(() => {
  getPrices();
}, 20000);
