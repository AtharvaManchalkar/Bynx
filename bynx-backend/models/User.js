const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["Admin", "Manager", "Worker"] },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
