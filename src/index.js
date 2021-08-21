const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  
  cors: {
    origin: "*"
  }
});

const port = 8080;

io.on("connection", () => {
  console.log("Connection");
})

httpServer.listen(port, () => {
  console.log(`Server listen: ${port}`);
});