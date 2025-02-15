mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  to: { type: String },
  from: { type: String },
  datetime: { type: Date, default: Date.now },
  message: { type: String, required: true },
  uid: { type: String },
});

module.exports = mongoose.model("Message", messageSchema);
