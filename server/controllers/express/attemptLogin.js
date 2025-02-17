const pool = require("../../config/db");
const bcrypt = require("bcrypt");

const attemptLogin = async (req, res) => {
  const potentialLogin = await pool.query(
    "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
    [req.body.username],
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash,
    );
    if (isSamePass) {
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
        userid: potentialLogin.rows[0].userid,
      };
      res.json({
        loggedIn: true,
        username: req.body.username,
        userid: potentialLogin.rows[0].userid,
      });
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password" });
    }
  } else {
    res.json({ loggedIn: false, status: "Wrong username or password" });
  }
};

module.exports = attemptLogin;
