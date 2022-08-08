const http = require("http");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const route = require("./routes/routers");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bookidgen = require("bookidgen");

const ourOwnUse = require("./forGettingTokens"); // For our own use

const app = express();
const port = process.env.PORT || 7000;
const server = http.createServer(app);

app.use(express.json());
app.use(helmet());
app.use(cors());

mongoose
  .connect(`mongodb+srv://aswin:aswin@cluster0.mfkse.mongodb.net/Skrate`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected..."))
  .catch((err) => console.log(err));

morgan.token("id", () => {
  return bookidgen("LOG-", 9999, 99999);
});

let accessLog = fs.createWriteStream(path.join(__dirname, "access.log"));
app.use(morgan(":id :method :status :url", { stream: accessLog }));

app.get("/", (req, res) => res.send("Success"));

app.use("/api", route);

app.use("/api/ownuse", ourOwnUse);

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
