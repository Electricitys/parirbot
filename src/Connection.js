'use strict';

class Connection {
  static generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  constructor(app, cred, socket) {
    this.app = app;
    this.id = Connection.generateUniqueId();
    this.socket = socket;
    this.socket.on("disconnect", () => {
      this.app.emit("logout", this);
    });
    this.cred = cred;
  }
}

module.exports = {
  Connection
}