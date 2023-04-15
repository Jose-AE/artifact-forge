import express, { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

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
      const email = response.data.email;
      const pfp = response.data.picture;

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        //create new user
        const createdUser = await User.create({ email, username, pfp });

        const token = jwt.sign(
          {
            email: createdUser.email,
            id: createdUser._id,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user: createdUser, token });
      } else {
        //sign in user
        const token = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        res.status(200).json({ user: existingUser, token });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid access token!" });
    });
});

export default router;
