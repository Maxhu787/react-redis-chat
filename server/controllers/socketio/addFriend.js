const redisClient = require("../../config/redis");

const addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add yourself." });
    return;
  }
  const friend = await redisClient.hgetall(`userid:${friendName}`);
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1,
  );
  if (Object.keys(friend).length === 0) {
    cb({ done: false, errorMsg: "User doesn't exist or hasn't been active." });
    // fetch from postgres too
    return;
  }
  if (
    currentFriendList &&
    currentFriendList.indexOf([friendName, friend.userid].join("\u0007")) !== -1
  ) {
    cb({ done: false, errorMsg: "Friend already added." });
    return;
  }
  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join("\u0007"),
  );
  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  cb({ done: true, newFriend });
};

module.exports = addFriend;
