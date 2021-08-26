'use strict';

const EventEmitter = require("events");
const { Channel } = require("./Channel");
const { Connection } = require("./Connection");
const io = require("socket.io");
const { GPIO } = require("./GPIO");

class Server extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.channels = [];
    this.io = io(options);

    this.io.on("connection", socket => {
      socket.on("authentication", (data) => {
        const connection = new Connection(this, data, socket);
        this.emit("login", connection);
      });
    });

    this.GPIO = new GPIO();
  }

  publish(channel, event, data) {
    console.log("publish: ", channel, event, data);
    this.channel(channel).emit(event, data);
  }

  channel(name) {
    if (!this.channels[name]) {
      this.channels[name] = new Channel(this, name);
    }
    return this.channels[name];
  }

  listen(port, cb = () => { }) {
    this.io.listen(port);
    cb();
  }
}

module.exports = {
  Server
}