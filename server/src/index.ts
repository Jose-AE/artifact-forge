const TEST_MODE = false;

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose, { Mongoose } from "mongoose";
import verifyToken from "./middleware/verifyToken";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

//req limit
const limiter = rateLimit({
  windowMs: 1000 * 60 * 15, //15 min
  max: 10000, //max of 10,000 req every 15 min
});

app.use(limiter);

//routes
import artifactRoutes from "./routes/artifactRoutes";
import userRoutes from "./routes/userRoutes";

app.use("/user", userRoutes);
app.use("/artifact", verifyToken, artifactRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(
  TEST_MODE
    ? (process.env.TEST_DB_URI as string)
    : (process.env.DB_URI as string),
  {
    dbName: "Main",
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Artifact Forge API 1.0");
});

app.listen(PORT, () => {
  console.log("server running in port: " + PORT);
});
