import express, { Request, Response } from "express";
import generateArtifact from "../utils/generateArtifact";
import { levelUpArtifact } from "../utils/levelUpArtifact";
import Artifact from "../models/artifactModel";
import User from "../models/userModel";
import mongoose from "mongoose";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

async function checkArtifactOwnership(
  artifactId: String,
  userId: String
): Promise<Boolean> {
  const artifact = await Artifact.findById(artifactId);

  return artifact.owner._id.toString() === userId;
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

router.post("/vote", async (req: Request | any, res: Response) => {
  const { artifactId, vote } = req.body;

  if (typeof artifactId == "string" && (vote === "up" || vote === "down")) {
    try {
      if (!(await checkArtifactOwnership(artifactId, req.userId as string))) {
        await Artifact.findOneAndUpdate(
          { _id: artifactId, voters: { $ne: req.userId } }, // find the artifact by its ID and make sure the user is not already in the voters array
          {
            $push: { voters: req.userId },
            $inc: { votes: vote === "up" ? 1 : -1 },
          }
        );

        res.status(202).send("voted for Artifact");
      } else {
        res.status(403).send("Cant vote for your own artifact");
      }
    } catch (error) {
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

//get showcase artifacts
router.get("/showcase-artifacts", async (req: Request | any, res: Response) => {
  try {
    const artifacts = await Artifact.find({ showcase: true })
      .sort({ votes: -1 }) // sort in descending order based on "votes"
      .limit(49)
      .populate("owner");

    res.status(200).send(artifacts);
  } catch (error) {
    res.status(500).send("Error getting artifacts");
  }
});

router.get("/for-vote", async (req: Request | any, res: Response) => {
  try {
    let randomArtifacts = await Artifact.aggregate([
      {
        $match: {
          showcase: true,
          owner: { $ne: new mongoose.Types.ObjectId(req.userId) },
          voters: { $ne: req.userId },
        },
      },

      {
        $sample: { size: req.query.num ? Math.abs(Number(req.query.num)) : 1 },
      },
    ]);

    randomArtifacts = randomArtifacts.filter(
      (obj: any, index: number) =>
        randomArtifacts.findIndex((item: any) => item._id === obj._id) === index
    );

    await User.populate(randomArtifacts, { path: "owner" });

    res.status(200).send(randomArtifacts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting artifacts");
  }
});

export default router;
