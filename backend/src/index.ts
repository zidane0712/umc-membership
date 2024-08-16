// [DEPENDENCIES]
import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

// [IMPORTS]\
import { errorHandler } from "./middleware/errorHandler";
import membershipRoutes from "./routes/membershipRoutes";
import annualRoutes from "./routes/annualRoutes";

// [APP CONFIGURATION]
const app: Application = express();
const PORT = process.env.PORT || 5000;

// [MIDDLEWARES]
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To handle requests from different origins
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// [MONGOOSE DB CONNECTION]
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connection open"))
  .catch((err: Error) => {
    console.log("Connection error");
    console.log(err);
  });

// [ROUTES]
app.use("/membership", membershipRoutes);
app.use("/annual", annualRoutes);

// Error handling middleware
app.use(errorHandler);

// [LISTENER]
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
