let mongoose = require("mongoose");
let Room = mongoose.Schema({
  typeRoom: String,
  lastMessageText: String,
  lastMessageTime: String,
  memberCount: Number
}, { versionKey: false });

module.exports = mongoose.model("Room", Room);
