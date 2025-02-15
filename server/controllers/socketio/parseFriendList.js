const redisClient = require("../../config/redis");

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split("\u0007");
    const friendConnected = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "connected",
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: friendConnected,
    });
  }
  return newFriendList;
};

module.exports = parseFriendList;
