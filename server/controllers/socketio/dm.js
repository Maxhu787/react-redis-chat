const redisClient = require("../../config/redis");
// const Message = require("../../models/messages")

const dm = async (socket, message) => {
  if (message.content == null || message.content.trim() === "") {
    console.log("bad");
  } else {
    // message.from = socket.user.userid;
    const messageString = [
      message.to,
      message.from,
      message.content.trim(),
    ].join("\u0007");

    /* let temp =  { 
      to: message.to,
      from: message.from,
      message: message.content.trim(),
      uid: [message.to, message.from].join(".") 
    }
    const messageMongo = new Message(temp);
    await messageMongo.save();
    */
    if (message.type === "dm") {
      await redisClient.lpush(`chat:${message.to}`, messageString);
      await redisClient.lpush(`chat:${message.from}`, messageString);
      await redisClient.incr(`chat:${message.to}:unread_count:${message.from}`);
      socket
        .to(message.to)
        .emit("dm", { message: message, from: message.from });
    } else {
      // console.log(message);
      const members = await redisClient.hget(`gc:${message.to}`, "members");
      const membersList = members?.split("\u0007");
      for (const member of membersList) {
        const member_id = await redisClient.hget(`userid:${member}`, "userid");
        await redisClient.lpush(`chat:${member_id}`, messageString);
        await redisClient.incr(`chat:${member_id}:unread_count:${message.to}`);
        socket.to(member_id).emit("dm", { message: message, from: message.to });
      }
    }
  }
};

module.exports = dm;
