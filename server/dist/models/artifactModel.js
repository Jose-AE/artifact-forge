"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const artifactSchema = mongoose.Schema({
    owner: { type: String, required: true },
    locked: { type: Boolean, required: true },
    showcase: { type: Boolean, required: true },
    artifactData: { type: Object, required: true },
    voters: [{ type: mongoose.Schema.Types.ObjectId }],
    votes: { type: Number, default: 0 },
});
exports.default = mongoose.model("Artifact", artifactSchema);
//# sourceMappingURL=artifactModel.js.map