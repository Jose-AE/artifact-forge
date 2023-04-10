import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "test.com" }));

//routes
import artifactRoutes from "./routes/artifactRoutes";
app.use("/", artifactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running in port: " + PORT);
});
