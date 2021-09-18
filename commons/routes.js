const express = require("express");
const waController = require("../controllers/wa.controller.js");

const { Router } = express;

const routes = Router();

routes.use("/", express.static("admin/dist"));
routes.use("/videos", express.static("videos"));
routes.post("/connect", waController.connect);
routes.get("/status", waController.getStatus);

module.exports = routes;
