import express, { Request, Response } from "express";
import generateArtifact from "../utils/generateArtifact";
import { levelUpArtifact } from "../utils/levelUpArtifact";
import Artifact from "../models/artifactModel";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

async function checkArtifactOwnership(
  artifactId: String,
  userId: String
): Promise<Boolean> {
  const artifact = await Artifact.findById(artifactId);
  return artifact.owner === userId;
}

router.post("/generate", async (req: Request | any, res: Response) => {
  const { domain } = req.body;

  if (typeof domain == "number") {
    try {
      const userArtifacts = await Artifact.find({ owner: req.userId });
      if (userArtifacts.length < 500) {
        const createdArtifact = await Artifact.create({
          owner: req.userId,
          locked: false,
          artifactData: generateArtifact(domain),
          showcase: false,
          voters: [],
          votes: 0,
        });
        res.status(201).send(createdArtifact);
      } else {
        res.status(409).send("Inventory full");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Invalid request body");
  }
});

router.post("/level-up", async (req: AuthenticatedRequest, res: Response) => {
  const { artifactId, levels } = req.body;

  if (artifactId && typeof levels == "number") {
    try {
      if (await checkArtifactOwnership(artifactId, req.userId as string)) {
        const artifact = await Artifact.findById(artifactId);
        const leveledUpArtifact = await Artifact.findByIdAndUpdate(
          artifactId,
          { artifactData: levelUpArtifact(levels, artifact.artifactData) },
          { new: true }
        );
        res.send(leveledUpArtifact);
      } else {
        res.status(403).send("User does not own artifact");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

router.post(
  "/switch-lock",
  async (req: AuthenticatedRequest, res: Response) => {
    const { artifactId } = req.body;

    if (typeof artifactId === "string") {
      try {
        if (await checkArtifactOwnership(artifactId, req.userId as string)) {
          const artifact = await Artifact.findById(artifactId);
          const updatedArtifact = await Artifact.findByIdAndUpdate(
            artifactId,
            {
              locked: !artifact.locked,
            },
            { new: true }
          );
          res.status(202).send(updatedArtifact);
        } else {
          res.status(403).send("User does not own artifact");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Invalid artifact id");
      }
    } else {
      res.status(500).send("Invalid request body ");
    }
  }
);

router.post(
  "/switch-showcase",
  async (req: AuthenticatedRequest, res: Response) => {
    const { artifactId } = req.body;

    if (typeof artifactId == "string") {
      try {
        if (await checkArtifactOwnership(artifactId, req.userId as string)) {
          const artifact = await Artifact.findById(artifactId);

          if (artifact.artifactData.level === 20) {
            const updatedArtifact = await Artifact.findByIdAndUpdate(
              artifactId,
              {
                showcase: !artifact.showcase,
              },
              { new: true }
            );
            res.status(202).send(updatedArtifact);
          } else {
            res.status(500).send("Artifact is not level 20");
          }
        } else {
          res.status(403).send("User does not own artifact");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Invalid artifact id");
      }
    } else {
      res.status(500).send("Invalid request body ");
    }
  }
);

router.post("/vote", async (req: AuthenticatedRequest, res: Response) => {
  const { vote, artifactId } = req.body;

  if (typeof vote == "string" && typeof artifactId == "string") {
    try {
      const artifact = await Artifact.findById(artifactId);
      if (artifact.voters.includes(req.userId)) {
        // User has already voted
        res.status(400).send("User has already voted for this artifact");
      } else {
        //user has not voted
        await Artifact.updateOne(
          { _id: artifactId },
          {
            $inc: { votes: vote === "up" ? 1 : -1 },
            $push: { voters: req.userId },
          }
        );
        res.status(202).send("Vote successful");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

router.post("/delete", async (req: Request | any, res: Response) => {
  const { artifactId } = req.body;

  if (typeof artifactId == "string") {
    try {
      if (await checkArtifactOwnership(artifactId, req.userId as string)) {
        await Artifact.deleteOne({
          _id: artifactId,
        });

        res.status(202).send("Artifact deleted");
      } else {
        res.status(403).send("User does not own artifact");
      }
    } catch (error) {
      res.status(500).send("Invalid artifact id");
    }
  } else {
    res.status(500).send("Invalid request body ");
  }
});

export default router;
