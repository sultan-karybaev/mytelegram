let mongoose = require("mongoose");
let TimePermission = mongoose.Schema({
  roomProfile: {type: mongoose.Schema.Types.ObjectId, ref: "roomProfile"},
  startTime: Number,
  endTime: Number,
  theLastText: String
}, { versionKey: false });

module.exports = mongoose.model("TimePermission", TimePermission);
