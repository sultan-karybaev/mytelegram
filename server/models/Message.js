let mongoose = require("mongoose");
let Message = mongoose.Schema({
  type: String,
  text: String,
  src: String,
  roomID: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  profileID: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
  time: Number
}, { versionKey: false });

module.exports = mongoose.model("Message", Message);
