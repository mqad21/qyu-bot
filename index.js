const express = require("express");
const cors = require("cors");
const routes = require("./commons/routes.js");

// Init dot env.
require("dotenv").config();

// Set base directory as global.
global.__basedir = __dirname;

// Express.
const app = express();
const server = require("http").createServer(app);
app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(process.env.NODE_PORT, () => {
  console.log("Server is listening at port " + process.env.NODE_PORT);
});

// Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
exports.io = io;

// Connect to WA.
require("./modules/wa_connection.js").connect();
