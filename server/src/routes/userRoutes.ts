import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import bcrypt from "bcrypt";

import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

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
            },
            process.env.JWT_SECRET as string
          );
          res.status(200).json({ user: createdUser, token });
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
            },
            process.env.JWT_SECRET as string
          );

          res.status(200).json({ user: existingUser, token });
        } catch (error) {
          console.log(error);
          res.status(500).send("Server error validating user token");
        }
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid access token!" });
    });
});

export default router;
