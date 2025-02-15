const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const attemptSignup = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username],
  );

  if (existingUser.rowCount === 0) {
    const passHash = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash, userid) VALUES($1,$2,$3) RETURNING id, username, userid",
      [req.body.username, passHash, uuidv4()],
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
      userid: newUserQuery.rows[0].userid,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username exists" });
  }
};

module.exports = attemptSignup;
