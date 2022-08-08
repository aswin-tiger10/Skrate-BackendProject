const express = require("express");

const Token = require("./models/tokenSchema");

const router = express.Router();

router.get("/tokens/all", async (req, res) => {
  try {
    const tokens = await Token.find();
    if (!tokens) {
      res.json({ message: "There is no tokens", status: false });
    } else {
      res.json({ message: "Tokens are listed below", tokens, status: true });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
});

module.exports = router;
