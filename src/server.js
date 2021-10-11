import express from "express";
import allRouters from "./api/index.js";
import { errorHandler } from "./utilities/errorHandler.js";
import cors from "cors";
import mongoose from "mongoose";

const server = express();
const port = process.env.PORT || 3001;
const whiteList = [
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_CLOUD_URL,
];
const corsOptions = {
  origin: function (origin, next) {
    console.log("ORIGIN ", origin);
    if (whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("CORS TROUBLES!!!!!"));
    }
  },
};

// Middlewares
server.use(express.json());

server.use(cors());
// Routes
server.use("/api", allRouters);
// Error Handler
server.use(errorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      console.log("✅✅✅ Running on port", port);
    })
  )
  .catch((err) => console.log(err));
