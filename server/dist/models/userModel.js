"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    googleId: { type: String, required: true },
    pfp: { type: String, required: false },
});
exports.default = mongoose.model("User", userSchema);
//# sourceMappingURL=userModel.js.map