const redisClient = require("../../config/redis");
const parseFriendList = require("./parseFriendList");

const fetchData = async (socket) => {
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1,
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  }
  console.log(`${socket.user.username} connected`, parsedFriendList);
  socket.emit("friends", friends);
  //groups
  const groupList = await redisClient.lrange(
    `groups:${socket.user.username}`,
    0,
    -1,
  );
  const parsedGroupList = [];
  for (const group of groupList) {
    const members = await redisClient.hget(`gc:${group}`, "members");
    if (members) {
      const memebersParsed = members.split("\u0007");
      parsedGroupList.push({
        group_hash: group,
        members: memebersParsed,
      });
    } else {
      // console.log("err: Group not found", group);
    }
  }
  socket.emit("groups", parsedGroupList);
  //
  //unread
  const parseUnreadList = async () => {
    const newUnreadList = {};
    for (let friend of friendList) {
      friend = friend.split("\u0007");
      const unreadCount = await redisClient.get(
        `chat:${socket.user.userid}:unread_count:${friend[1]}`,
      );
      newUnreadList[friend[1]] = unreadCount;
    }
    for (let group of groupList) {
      const unreadCount = await redisClient.get(
        `chat:${socket.user.userid}:unread_count:${group}`,
      );
      newUnreadList[group] = unreadCount;
    }

    return newUnreadList;
  };
  const parsedUnreadList = await parseUnreadList();
  socket.emit("unread", parsedUnreadList);

  const msgQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1,
  );
  const messages = msgQuery.map((msgStr) => {
    const parsedStr = msgStr.split("\u0007");
    return {
      to: parsedStr[0],
      from: parsedStr[1],
      content: parsedStr[3],
    };
  });
  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }
};

module.exports = fetchData;
