'use strict';

class Channel {
  constructor(app, name) {
    this.app = app;
    this.name = name;
    this.connections = {};
  }
  join(connection) {
    this.connections[connection.id] = connection;
  }
  leave(connection) {
    delete this.connections[connection.id];
  }
  emit(event, data) {
    for(let value of Object.values(this.connections)) {
      value.socket.emit(event, data);
    }
  }
}

module.exports = {
  Channel
}