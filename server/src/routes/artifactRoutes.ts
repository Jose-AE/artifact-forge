import express, { Request, Response } from "express";
import generateArtifact from "../utils/generateArtifact";
import { levelUpArtifact } from "../utils/levelUpArtifact";
import Artifact from "../models/artifactModel";

const router = express.Router();

router.post("/generate", async (req: Request | any, res: Response) => {
  const { domain } = req.body;

  if (typeof domain == "number") {
    try {
      const createdArtifact = await Artifact.create({
        owner: req.userId,
        locked: false,
        forShowcase: false,
        artifactData: generateArtifact(domain),
      });
      res.status(201).send(createdArtifact);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Invalid request body");
  }
});

router.post("/level-up", async (req: Request, res: Response) => {
  const { artifactId, levels } = req.body;

  if (artifactId && typeof levels == "number") {
    try {
      const artifact = await Artifact.findById(artifactId);
      const leveledUpArtifact = await Artifact.findByIdAndUpdate(
        artifactId,
        { artifactData: levelUpArtifact(levels, artifact.artifactData) },
        { new: true }
      );
      res.send(leveledUpArtifact);
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

router.post("/set-locked", async (req: Request, res: Response) => {
  const { artifactId, locked } = req.body;

  if (artifactId && typeof locked == "boolean") {
    try {
      await Artifact.findByIdAndUpdate(artifactId, { locked });
      res.status(202).send("Artifact locked/unlocked");
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

router.post("/set-showcase", async (req: Request, res: Response) => {
  const { artifactId, showcase } = req.body;

  if (artifactId && typeof showcase == "boolean") {
    try {
      await Artifact.findByIdAndUpdate(artifactId, { showcase });
      res.status(202).send("Artifact set/unset for showcase");
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

export default router;
