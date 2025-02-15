const authorizeUser = require("./socketio/authorizeUser");
const initializeUser = require("./socketio/initializeUser");
const addFriend = require("./socketio/addFriend");
const onDisconnect = require("./socketio/onDisconnect");
const fetchData = require("./socketio/fetchData");
const dm = require("./socketio/dm");
const createGroup = require("./socketio/createGroup");
const clearUnread = require("./socketio/clearUnread");
module.exports = {
  addFriend,
  authorizeUser,
  initializeUser,
  onDisconnect,
  fetchData,
  dm,
  createGroup,
  clearUnread,
};
