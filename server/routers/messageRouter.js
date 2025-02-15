const express = require("express");
const router = express.Router();
const rateLimiter = require("../controllers/express/rateLimiter");
const messageController = require("../controllers/messageController");

router
  .route("/test")
  .get(rateLimiter(60, 100), messageController.createMessage);

module.exports = router;
