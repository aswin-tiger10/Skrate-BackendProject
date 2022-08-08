const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      res.json({ message: "Unauthorized", status: false });
    } else {
      const decode = jwt.verify(token, "A-Secret-Key");
      req.data = decode;
      const user = User.findOne({ userName: req.data.userName });
      if (!user) {
        res.json({ message: "Unauthorized", status: false });
      } else {
        next();
      }
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

module.exports = authentication;
