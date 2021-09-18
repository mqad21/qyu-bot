const { expressServer } = require("../index");
const { Server } = require("socket.io");

let io;

const socketServer = new Server(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socketServer.on("connection", function (io_) {
  io = io_;
});

module.exports = io;
