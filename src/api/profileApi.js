import express from "express";
import createError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import profileModel from "../models/profile.js";
import experienceModel from "../models/experience.js";
import q2m from "query-to-mongo";
import { generatePdf } from "../utilities/generatePdf.js";
import { pipeline } from "stream";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const { _id } = await newProfile.save();
    res.status(201).send(_id);
  } catch (error) {
    next(createError(400, error));
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const data = await profileModel
      .find(query.criteria, query.options.fields)
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit);
    const total = await profileModel.countDocuments(query.criteria);

    res.send({ total, links: query.links("/profile", total), data });
  } catch (error) {
    next(createError(500, "profile fetch failed!"));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await profileModel.findById(req.params.id);
    if (data) {
      res.send(data);
    } else {
      next(createError(404, "profile not found!"));
    }
  } catch (error) {
    next(createError(500, "fetching requested profile failed!"));
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await profileModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (data) {
      res.send(data);
    } else {
      next(createError(404, "profile not found!"));
    }
  } catch (error) {
    next(createError(500, "updating requested profile failed!"));
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await profileModel.findByIdAndDelete(req.params.id);

    if (data) {
      res.status(204).send("deleted successfully");
    } else {
      next(createError(404, "profile not found!"));
    }
  } catch (error) {
    next(createError(500, "deleting requested profile failed!"));
  }
});

// all experiences of a profile
router.get("/:id/experiences", async (req, res, next) => {
  try {
    const exp = await experienceModel.find({
      profile: req.params.id,
    });

    if (exp) {
      res.send(exp);
    } else {
      next(createError(404, "no experience found for this profile!"));
    }
  } catch (error) {
    next(createError(500, "fetching experiences of requested profile failed!"));
  }
});

// image upload
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Linkedin-ProfilePics",
  },
});
router.post(
  "/:id/picture",
  multer({ storage: cloudinaryStorage }).single("profile"),
  async (req, res, next) => {
    try {
      const profile = await profileModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { new: true }
      );

      if (profile) {
        res.send(profile);
      } else {
        next(createError(404, "profile not found!"));
      }
    } catch (error) {
      next(createError(500, "updating profile picture failed!"));
    }
  }
);

// pdf download

router.get("/:id/cv-download", async (req, res, next) => {
  try {
    const profile = await profileModel.findById(req.params.id);
    const exp = await experienceModel.find({
      profile: req.params.id,
    });
    const source = generatePdf(profile, exp);
    const destination = res;
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    pipeline(source, destination, (err) => next(err));
  } catch (error) {
    next(createError(500, "downloading pdf failed!"));
  }
});
export default router;
