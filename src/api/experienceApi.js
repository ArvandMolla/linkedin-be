import express from "express";
import createError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import experienceModel from "../models/experience.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newExperience = new experienceModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(createError(400, error));
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = await experienceModel.find().populate("profile");
    res.send(data);
  } catch (error) {
    next(createError(500, "experience fetch failed!"));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await experienceModel.findById(req.params.id);
    if (data) {
      res.send(data);
    } else {
      next(createError(404, "experience not found!"));
    }
  } catch (error) {
    next(createError(500, "fetching requested experience failed!"));
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await experienceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    if (data) {
      res.send(data);
    } else {
      next(createError(404, "experience not found!"));
    }
  } catch (error) {
    next(createError(500, "updating requested experience failed!"));
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await experienceModel.findByIdAndDelete(req.params.id);

    if (data) {
      res.status(204).send("deleted successfully");
    } else {
      next(createError(404, "experience not found!"));
    }
  } catch (error) {
    next(createError(500, "deleting requested experience failed!"));
  }
});

// experience image
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Linkedin-ExperiencePics",
  },
});

router.post(
  "/:id/image",
  multer({ storage: cloudinaryStorage }).single("experience"),
  async (req, res, next) => {
    try {
      const experience = await experienceModel.findByIdAndUpdate(
        req.params.id,
        { experienceImage: req.file.path },
        { new: true }
      );

      if (experience) {
        res.send(experience);
      } else {
        next(createError(404, "experience not found!"));
      }
    } catch (error) {
      next(createError(500, "updating experience picture failed!"));
    }
  }
);

export default router;
