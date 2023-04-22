const mongoose = require("mongoose");

const artifactSchema = mongoose.Schema({
  owner: { type: String, required: true },
  locked: { type: Boolean, required: true },
  showcase: { type: Boolean, required: true },
  artifactData: { type: Object, required: true },
});

export default mongoose.model("Artifact", artifactSchema);
