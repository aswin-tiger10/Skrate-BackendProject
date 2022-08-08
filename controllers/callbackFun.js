const User = require("../models/userSchema");
const Token = require("../models/tokenSchema");
const Ticket = require("../models/ticketSchema");

const jwt = require("jsonwebtoken");
const bookidgen = require("bookidgen");

// New User Registration
const userRegistration = async (req, res) => {
  let { userName, role } = req.body;
  if (!userName || !role) {
    res.json({ message: "Enter all data", status: false });
  } else if (role != ("employee" && "admin")) {
    res.json({
      message: "Role should be either employee or admin",
      status: false,
    });
  } else {
    const oldUser = await User.findOne({ userName });
    if (oldUser) {
      res.json({
        message: "Username already exists.. Try another one",
        status: false,
      });
    } else {
      try {
        const user = await User.create({ userName, role });
        if (!user) {
          res.json({
            message: "Something went wrong.. Try again",
            status: false,
          });
        } else {
          let token = jwt.sign(
            {
              userName: user.userName,
              role: user.role,
            },
            "A-Secret-Key"
          );
          user.token = token;

          // For getting tokens later as we dont have login page
          const newToken = await Token.create({ token, userName, role });

          res.json({
            message: "User registered successfully",
            token,
            status: true,
          });
        }
      } catch (error) {
        res.json({ message: error.message, status: false });
      }
    }
  }
};

// New ticket raised
const newTicket = async (req, res) => {
  if (req.data.role != "admin") {
    res.json({ message: "Only admins can raise tickets", status: false });
  } else {
    let { title, description, priority, assignedTo } = req.body;
    if (!title || !description || !priority || !assignedTo) {
      res.json({ message: "Enter all fields", status: false });
    } else {
      if (priority != ("low" && "medium" && "high")) {
        res.json({
          message: "Priority must be either low or medium or high",
          status: false,
        });
      } else {
        try {
          const employee = await User.findOne({ userName: assignedTo });
          if (!employee) {
            res.json({
              message: "Enter the correct user name of employee",
              status: false,
            });
          } else {
            if (employee.role != "employee") {
              res.json({
                message: "Tickets can be assigned only to employees",
                status: false,
              });
            } else {
              const ticket = await Ticket.create({
                id: bookidgen("TICKET-", 9999, 999999),
                title,
                description,
                status: "open",
                priority,
                assignedTo,
              });
              if (!ticket) {
                res.json({
                  message: "Something went wrong... Try again",
                  status: false,
                });
              } else {
                res.json({
                  message: "Ticket raised successfully",
                  TicketId: id,
                  status: true,
                });
              }
            }
          }
        } catch (error) {
          res.json({ message: error.message, status: false });
        }
      }
    }
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    if (!tickets) {
      res.json({ message: "There is no ticket to show", status: false });
    } else {
      res.json({ message: "Tickets are shown below", tickets, status: true });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

// Get tickets by query
const getTicketsByQuery = async (req, res) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.title) query.title = req.query.title;
    if (req.query.priority) query.priority = req.query.priority;

    const tickets = await Ticket.find({ query });
    if (!tickets) {
      res.json({ message: "There is no tickets to show", status: false });
    } else {
      res.jaon({ message: "Tickets are shown below", tickets, status: true });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

// Closing of Tickets
const closingTickets = async (req, res) => {
  if (req.data.role != "admin") {
    res.json({ message: "Only admin can close the tickets", status: false });
  } else {
    let ticketId = req.body.ticketId;
    if (!ticketId) res.json({ message: "Enter ticket id", status: false });
    else {
      try {
        const ticket = await Ticket.findOne({ id: ticketId });
        if (!ticket) {
          res.json({ message: "Enter valid ticket id", status: false });
        } else {
          const tickets = await Ticket.find({ assignedTo: ticket.assignedTo });
          let priorityArray = [];
          tickets.forEach((ele, i) => {
            if (ele.status == "open") {
              priorityArray.push(ele.priority);
            }
          });
          var set = new Set(priorityArray);
          if (
            (ticket.priority == "medium" && set.has("high")) ||
            (ticket.priority == "low" && set.has("medium" || "high"))
          ) {
            res.json({
              message:
                "User has a higher priority ticket to be closed.. Hence this ticket cannot be closed",
              status: false,
            });
          } else {
            const closeTicket = await Ticket.findOneAndUpdate(
              { id: ticketId },
              { status: "close" },
              { new: true }
            );
            if (!closeTicket) {
              res.json({
                message: "Something went wrong.. Try again",
                status: false,
              });
            } else {
              res.json({
                message: `Ticket with id ${ticketId} is closed successfully`,
                status: true,
              });
            }
          }
        }
      } catch (error) {
        res.json({ message: error.message, status: false });
      }
    }
  }
};

// Delete Ticket
const deleteTicket = async (req, res) => {
  if (req.data.role != "admin") {
    res.json({ message: "Only admins can delete the ticket", status: false });
  } else {
    try {
      let ticketId = req.body.ticketId;
      if (!ticketId)
        res.json({ message: "Enter ticket id to delete", status: false });
      else {
        const ticket = await Ticket.findOneAndDelete({ id: ticketId });
        if (!ticket) {
          res.json({
            message: "Enter correct ticket id to delete",
            status: false,
          });
        } else {
          res.json({
            message: `Ticket with id ${ticketId} is deleted successfully`,
            status: true,
          });
        }
      }
    } catch (error) {
      res.json({ message: error.message, status: false });
    }
  }
};

module.exports = {
  userRegistration,
  newTicket,
  getAllTickets,
  getTicketsByQuery,
  closingTickets,
  deleteTicket,
};
