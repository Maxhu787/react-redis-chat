const redisClient = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");

const createGroup = async (socket, groupMembers, cb) => {
  const groupHash = uuidv4();

  if (groupMembers.includes(socket.user.username)) {
    let index = groupMembers.indexOf(socket.user.username);
    groupMembers.splice(index, 1);
    groupMembers.unshift(socket.user.username);
  } else {
    groupMembers.unshift(socket.user.username);
  }

  if (groupMembers.length <= 1) {
    cb({ done: false, errorMsg: "Please enter two or more members" });
    return;
  }

  for (const member of groupMembers) {
    const friend = await redisClient.hgetall(`userid:${member}`);
    if (Object.keys(friend).length === 0) {
      cb({ done: false, errorMsg: "User doesn't exist." });
      return;
    }
    await redisClient.lpush(`groups:${member}`, groupHash);
  }

  await redisClient.hset(
    `gc:${groupHash}`,
    "members",
    groupMembers.join("\u0007"),
  );

  const newGroupChat = {
    group_hash: groupHash,
    members: groupMembers,
  };
  cb({ done: true, newGroupChat });
};

module.exports = createGroup;
