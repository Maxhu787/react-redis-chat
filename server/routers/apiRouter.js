const express = require("express");
const router = express.Router();
const rateLimiter = require("../controllers/express/rateLimiter");
const redisClient = require("../config/redis");
const pool = require("../config/db");

router.get("/", rateLimiter(60, 100, "fuck off"), (req, res) => {
  data = {
    routes: ["/chatlog", "/users"],
  };
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 3));
});

router.get("/chatlog", rateLimiter(60, 100, "fuck off"), (req, res) => {
  const messages = async () => {
    let cursor = "0";
    let allMessages = [];

    do {
      const [newCursor, keys] = await redisClient.scan(
        cursor,
        "MATCH",
        "chat:*",
      );
      cursor = newCursor;

      for (const key of keys) {
        const keyType = await redisClient.type(key);
        if (keyType !== "list") {
          continue;
        }
        const msgQuery = await redisClient.lrange(key, 0, -1);
        const keyMessages = msgQuery.map((msgStr) => {
          const parsedStr = msgStr.split("\u0007");
          return {
            to: parsedStr[0],
            from: parsedStr[1],
            content: parsedStr[2],
          };
        });
        keyMessages.forEach((msg) => {
          allMessages.push({
            To: msg.to,
            From: msg.from,
            Content: msg.content,
          });
        });
      }
    } while (cursor !== "0");
    return allMessages;
  };

  messages().then((chatlog) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(chatlog, null, 3));
  });
});

router.get("/users", rateLimiter(60, 100, "fuck off"), (req, res) => {
  const users = async () => {
    let cursor = "0";
    let allUsers = [];

    do {
      const [newCursor, keys] = await redisClient.scan(
        cursor,
        "MATCH",
        "userid:*",
      );
      cursor = newCursor;

      for (const key of keys) {
        const userFields = await redisClient.hgetall(key);
        if (userFields) {
          allUsers.push({
            userid: userFields.userid,
            connected: userFields.connected === "true",
          });
        }
      }
    } while (cursor !== "0");

    return allUsers;
  };

  users().then((users) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(users, null, 3));
  });
});

router.get(
  "/user/:username",
  rateLimiter(60, 100, "fuck off"),
  async (req, res) => {
    const existingUser = await pool.query(
      "SELECT username, userid, profile_picture, bio from users WHERE username=$1",
      [req.params.username],
    );

    if (existingUser.rowCount === 0) {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ responce: false }, null, 3));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ responce: existingUser["rows"] }, null, 3));
    }
  },
);

router.get(
  "/userid/:userid",
  rateLimiter(60, 100, "fuck off"),
  async (req, res) => {
    const existingUser = await pool.query(
      "SELECT username, userid, profile_picture, bio from users WHERE userid=$1",
      [req.params.userid],
    );

    if (existingUser.rowCount === 0) {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ responce: false }, null, 3));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ responce: existingUser["rows"][0] }, null, 3));
    }
  },
);

router.get("/allusers", rateLimiter(60, 100, "fuck off"), async (req, res) => {
  const users = await pool.query("SELECT username from users");

  if (users.rowCount === 0) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ responce: false }, null, 3));
  } else {
    data = [];
    users["rows"].map((user) => {
      data.push({
        username: user.username,
        value: user.username,
        label: user.username,
        colorScheme: "blue",
      });
    });
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ responce: data }, null, 3));
  }
});

module.exports = router;
