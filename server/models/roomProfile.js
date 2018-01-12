let mongoose = require("mongoose");
let roomProfile = mongoose.Schema({
  roomID: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  profileID: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
  unreadMessageCount: Number,
  index: Number,
  name: String,
  img: String
}, { versionKey: false });

module.exports = mongoose.model("roomProfile", roomProfile);
