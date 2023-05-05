const mongoose = require("mongoose");

const artifactSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  locked: { type: Boolean, required: true },
  showcase: { type: Boolean, required: true },
  artifactData: { type: Object, required: true },
  voters: { type: Array<string> },
  votes: { type: Number, default: 0 },
});

export default mongoose.model("Artifact", artifactSchema);
