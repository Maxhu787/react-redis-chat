const express = require("express");
const validateForm = require("../controllers/express/validateForm");
const router = express.Router();
const {
  handleLogin,
  attemptLogin,
  attemptSignup,
} = require("../controllers/authController");
const rateLimiter = require("../controllers/express/rateLimiter");

router
  .route("/login")
  .get(handleLogin)
  .post(validateForm, rateLimiter(60, 100), attemptLogin);

router.post("/signup", validateForm, rateLimiter(60, 100), attemptSignup);

router.post("/logout", (req, res) => {
  res.clearCookie("sid");
  req.session.destroy((err) => {
    res.send();
  });
});

module.exports = router;
