const express = require("express");
const router = express.Router();

const auth = require("../authMiddleware/auth");
const callBackFun = require("../controllers/callbackFun");

// User Registration
router.post("/users/new", callBackFun.userRegistration);

// New Ticket raised
router.post("/ticket/new", auth, callBackFun.newTicket);

// Get all Tickets
router.get("/tickets/all", auth, callBackFun.getAllTickets);

// Get Tickets by id
router.get("/tickets", auth, callBackFun.getTicketsByQuery);

// Closing of Tickets
router.patch("/tickets/markAsClosed", auth, callBackFun.closingTickets);

// Deleting Tickets
router.delete("/tickets/delete", auth, callBackFun.deleteTicket);

module.exports = router;
