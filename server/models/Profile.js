let mongoose = require("mongoose");
let Profile = mongoose.Schema({
  firstName: String,
  lastName: String,
  avatar: String,
  phone: Number,
  password: {
    type: String,
    unique: true
  }
}, { versionKey: false });

module.exports = mongoose.model("Profile", Profile);
