const express = require("express");
const http = require("http");
const morgan = require("morgan");
const app = express();
const server = http.createServer(app);
const fs = require("fs");
const path = require("path");

app.use(express.json());

morgan.token("id", (req) => {
  return 1;
});

let accessLog = fs.createWriteStream(path.join(__dirname, "access.log"));
app.use(morgan(":id :method :status :url", { stream: accessLog }));

app.get("/", (req, res) => res.send("Success"));

server.listen(5000, () => console.log("http://localhost:5000"));
