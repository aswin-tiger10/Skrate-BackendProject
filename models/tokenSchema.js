const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: { type: String },
  userName: { type: String },
  role: { type: String },
});

module.exports = mongoose.model("token", tokenSchema);
