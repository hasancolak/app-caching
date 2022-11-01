const express = require("express");
const app = express();
const path = require("path");

app.use("/", express.static(path.join(__dirname, "static")));

app.listen(3002, () => {
  console.log("Listen on the port 3002...");
});
