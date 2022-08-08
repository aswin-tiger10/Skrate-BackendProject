const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    description: { type: String },
    status: { type: String },
    priority: { type: String },
    assignedTo: { type: String },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("ticket", ticketSchema);
