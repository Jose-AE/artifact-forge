import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import Artifact from "../models/artifactModel";

import * as dotenv from "dotenv";
import verifyToken from "../middleware/verifyToken";
import { GUEST_AVATARS } from "../data/guestAvatars";
dotenv.config();

const router = express.Router();

///
//Verify jwt
///
router.get("/verify-token", async (req: any, res: Response) => {
  const token = req.cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET as string) as any;
    res.status(200).send("valid");
  } catch (err) {
    res.status(200).send("invalid");
  }
});

////
//Get logged user artifacts
////
router.get("/artifacts", verifyToken, async (req: any, res: Response) => {
  try {
    const artifacts = await Artifact.find({ owner: req.userId });
    res.status(200).send(artifacts);
  } catch (err) {
    res.status(401).send("Error getting artifacts");
  }
});

////
//Logout user route
////
router.post("/logout", async (req: Request, res: Response) => {
  const { guestId } = req.body;

  if (guestId) {
    try {
      const guestUser = await User.findOne({ googleId: guestId });

      const token = jwt.sign(
        {
          userId: guestUser._id,
          username: guestUser.username,
          pfp: guestUser.pfp,
        },
        process.env.JWT_SECRET as string
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10, // 10 years
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "lax",
      });

      res.status(200).send("User logged out");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error logging out");
    }
  } else {
    res.clearCookie("token");
    res.status(200).send("User logged out");
  }
});

////
//Get logged user route
////
router.get("/get", (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(200).send(null);
  } else {
    try {
      const { pfp, username } = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;
      res.status(200).send({ pfp, username });
    } catch (err) {
      res.status(401).send("Invalid jwt");
    }
  }
});

////
//Login user route
////
router.post("/login", async (req: Request, res: Response) => {
  const { googleAccessToken } = req.body;

  axios
    .get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    })
    .then(async (response) => {
      const username = response.data.given_name;
      const googleId = response.data.sub;
      const pfp = response.data.picture;

      const existingUser = await User.findOne({ googleId });

      if (!existingUser) {
        //upgrade guest account

        const { userId } = jwt.verify(
          req.cookies.token,
          process.env.JWT_SECRET as string
        ) as any;

        try {
          const updatedUser = await User.findByIdAndUpdate(userId, {
            googleId,
            username,
            pfp,
          });

          const token = jwt.sign(
            {
              userId: updatedUser._id,
              username,
              pfp,
            },
            process.env.JWT_SECRET as string
          );

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Day Age,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "lax",
          });

          res.status(201).send("created");
        } catch (error) {
          console.log(error);
          res.status(500).send("Server error creating user");
        }
      } else {
        //sign in user

        try {
          const token = jwt.sign(
            {
              userId: existingUser._id,
              username,
              pfp,
            },
            process.env.JWT_SECRET as string
          );

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Day Age,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "lax",
          });

          res.status(202).send("Account logged in");
        } catch (error) {
          res.status(500).send("Server error validating user token");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Invalid google access token!");
    });
});

router.post("/create-guest", async (req: Request, res: Response) => {
  const { guestId } = req.body;

  try {
    //random pfp
    const pfp = GUEST_AVATARS[Math.floor(Math.random() * GUEST_AVATARS.length)];

    // username
    const username = "Guest";

    const createdUser = await User.create({
      googleId: guestId,
      username,
      pfp,
    });

    const token = jwt.sign(
      {
        userId: createdUser._id,
        username,
        pfp,
      },
      process.env.JWT_SECRET as string
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10, // 10 years
      domain: process.env.COOKIE_DOMAIN,
      sameSite: "lax",
    });

    res.status(201).send("Guest account created");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error creating guest user");
  }
});

export default router;
