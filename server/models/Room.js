let mongoose = require("mongoose");
let Room = mongoose.Schema({
  typeRoom: String,
  lastMessageText: String,
  lastMessageTime: String,
}, { versionKey: false });

module.exports = mongoose.model("Room", Room);
