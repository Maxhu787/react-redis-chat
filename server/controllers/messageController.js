const Message = require("../models/messages");

exports.createMessage = async (req, res) => {
  try {
    console.log(req.query);
    const message = new Message(req.query);
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
};
