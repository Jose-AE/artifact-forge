import express, { Request, Response } from "express";
import generateArtifact from "../utils/generateArtifact";
import { levelUpArtifact } from "../utils/levelUpArtifact";
import { Artifact } from "../utils/artifactType";

const router = express.Router();

router.post("/generate-artifact", async (req: Request, res: Response) => {
  res.send(generateArtifact(req.body.domain));
});

router.post("/level-up-artifact", async (req: Request, res: Response) => {
  const { artifact, levels } = req.body;
  res.send(levelUpArtifact(levels, artifact));
});

export default router;
