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
      const createdArtifact = await Artifact.create({
        owner: req.userId,
        locked: false,
        artifactData: generateArtifact(domain),
        showcase: false,
        voters: [],
        votes: 0,
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

router.post("/set-locked", async (req: AuthenticatedRequest, res: Response) => {
  const { artifactId, locked } = req.body;

  if (artifactId && typeof locked == "boolean") {
    try {
      if (await checkArtifactOwnership(artifactId, req.userId as string)) {
        const artifact = await Artifact.findByIdAndUpdate(artifactId, {
          locked,
        });
        res.status(202).send(artifact);
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
  "/set-showcase",
  async (req: AuthenticatedRequest, res: Response) => {
    const { artifactId, showcase } = req.body;

    if (typeof artifactId == "string" && typeof showcase == "boolean") {
      try {
        if (await checkArtifactOwnership(artifactId, req.userId as string)) {
          await Artifact.findByIdAndUpdate(artifactId, { showcase });
          res.status(202).send("Artifact set/unset for showcase");
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
