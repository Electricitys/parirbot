'use strict';

const { Server } = require("./Server");

const options = {
  cors: {
    origin: "*"
  }
};

let robotReady = 0;
let robotAction = 0;
let targetRoom = 0;

const app = new Server(options);

app.on("login", (connection) => {
  const cred = connection.cred;
  const socket = connection.socket;
  switch (cred.type) {
    case "room":
      app.channel(`rooms`).join(connection);
      app.channel(`room/${cred.number}`).join(connection);
      socket.on("room", (data) => {
        app.emit("room", data, connection);
      });
      break;
    case "robot":
      app.channel(`robot`).join(connection);
      socket.on("robot", (data) => {
        app.emit("robot", data, connection);
      });
      break;
    case "control":
      app.channel(`control`).join(connection);
      break;
  }
  console.log("login", connection.cred);
});

app.on("logout", (connection) => {
  const cred = connection.cred;
  switch (cred.type) {
    case "room":
      app.channel("rooms").leave(connection);
      app.channel(`room/${cred.number}`).leave(connection);
      break;
    case "robot":
      app.channel(`robot`).leave(connection);
      break;
    case "control":
      app.channel(`control`).leave(connection);
      break;
  }
})

app.on("room", (data, connection) => {
  const number = connection.cred.number;
  console.log(`room-${number}`, data);
  if (data.type === "state") {
    if(number === targetRoom) {
      if (robotAction === 1) {
        console.log("robot action", robotAction);
        robotAction = 0;
        app.publish("robot", "action", robotAction);
        app.publish(`room/${targetRoom}`, "action", 1);
      }
    }
  }
});

app.on("robot", (data) => {
  console.log("robot", data);
  if (data.type === "ready") {
    robotReady = data.value;
    if(targetRoom > 0) {
      if (robotReady === 0) {
        console.log("[robot] back");
        robotAction = 2;
        app.publish("robot", "action", robotAction);
        app.publish(`rooms`, "action", 0);
        targetRoom = 0;
      }
    }
  };
});

for (let i = 1; i <= 6; i++) {
  console.log(`button ${i} init`);
  app.GPIO.button(`room-${i}`).watch((err, value) => {
    if (err) {
      throw err;
    }
    console.log(`room-${i} button value:`, value);
    console.log("ROBOT", robotReady);
    if (robotReady) {
      console.log("SEND");
      robotAction = 1;
      app.publish("robot", "action", robotAction);
      targetRoom = i;
      // app.publish("room", "action", "");
      // app.publish(`room/${i}`, "action", "");
    }
  })
}

app.GPIO._sens.watch((err, value) => {
  if (err) {
    throw err;
  }

  if (!value) {
    if (robotAction === 2) {
      robotAction = 0;
      app.publish("robot", "action", robotAction);
    }
  }

  console.log("sens", value);
})

// setInterval(() => {
//   app.publish("robot", "action", Math.round(Math.random() * 3));
// }, 2000);

module.exports = app;