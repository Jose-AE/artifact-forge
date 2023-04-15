const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  pfp: { type: String, required: false },
});

export default mongoose.model("User", userSchema);
