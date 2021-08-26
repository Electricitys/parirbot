const app = require("./app");

const port = 3000;

app.listen(port, () => {
  console.log("GPIO is accessible", app.GPIO.accessible);
  console.log(`Listen on port: ${port}`);
});
