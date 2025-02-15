const redisClient = require("../../config/redis");

const clearUnread = async (socket, id) => {
  socket.user = { ...socket.request.session.user };
  redisClient.del(`chat:${socket.user.userid}:unread_count:${id}`);
  // console.log("deleted", socket.user.userid, id);
};

module.exports = clearUnread;
