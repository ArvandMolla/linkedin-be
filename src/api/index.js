import express from "express";
import profileApi from "./profileApi.js";
import postApi from "./postApi.js";
import experienceApi from "./experienceApi.js";

const router = express.Router();

router.use("/profile", profileApi);
router.use("/post", postApi);
router.use("/experience", experienceApi);

export default router;
