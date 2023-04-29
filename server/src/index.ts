import express, { Request, Response } from "express";
import cors from "cors";
import mongoose, { Mongoose } from "mongoose";
import verifyToken from "./middleware/verifyToken";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

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

//routes
import artifactRoutes from "./routes/artifactRoutes";
import userRoutes from "./routes/userRoutes";

app.use("/user", userRoutes);
app.use("/artifact", verifyToken, artifactRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI as string, {
  dbName: "Main",
});

app.get("/", (req: Request, res: Response) => {
  res.send("Artifact Forge API");
});

app.listen(PORT, () => {
  console.log("server running in port: " + PORT);
});
