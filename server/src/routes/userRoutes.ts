import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import Artifact from "../models/artifactModel";

import * as dotenv from "dotenv";
import verifyToken from "../middleware/verifyToken";
dotenv.config();

const router = express.Router();

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
router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { domain: process.env.COOKIE_DOMAIN, path: "/" });
  res.status(200).send("User logged out");
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
router.post("/login", (req: Request, res: Response) => {
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
        //create new user

        try {
          const createdUser = await User.create({
            googleId,
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
            maxAge: 1000 * 60 * 60 * 24 * 30, // 14 Day Age,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "lax",
          });

          res.status(201).send({ pfp, username });
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
            maxAge: 1000 * 60 * 60 * 24 * 30, // 14 Day Age,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "lax",
          });

          res.status(202).send({ pfp, username });
        } catch (error) {
          res.status(500).send("Server error validating user token");
        }
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid access token!" });
    });
});

export default router;
