const express = require("express");
require("dotenv").config();
const colors = require("colors");
const http = require("http");
const routes = require("./routes");
const schedule = require("node-schedule");
const bodyParser = require("body-parser");
const app = express();
const server = new http.Server(app);
const log = console.log;
const os = require("os");
const mongoose = require("mongoose");
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
log("totalMemory : ".red + totalMemory);
log("freeMemory : ".magenta + freeMemory);
require("express-async-errors");
require("winston-mongodb");
class Application {
  constructor() {
    this.setupRoutes();
    this.startServer();
    this.setupMongoose();
  }

  setupMongoose() {
    const run = schedule.scheduleJob("*/15 * * * *", function () {
      console.log("run".bold);
    });
    mongoose
      .connect(process.env.DBURL)
      .then(() => {
        console.log("db connected".green);
      })
      .catch((err) => {
        console.log("db not connected".red, err);
      });
  }

  setupRoutes() {
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(routes);
  }

  startServer() {
    const port = process.env.MY_PORT || 5400;
    server.listen(port, (err) => {
      if (err) console.log(err);
      else console.log("app listen to port : ".blue + port);
    });
  }
}

module.exports = Application;
