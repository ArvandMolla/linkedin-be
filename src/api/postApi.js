import express, { text } from "express";
import createError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import postModel from "../models/post.js";
import profileModel from "../models/profile.js";
import q2m from "query-to-mongo";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { text, profileId } = req.body;
    const profile = await profileModel.findById(profileId);
    const finalPost = {
      text,
      profile,
    };

    const data = new postModel(finalPost);
    const { _id } = await data.save();
    res.send(_id);
  } catch (error) {
    next(createError(500, "post creation failed!"));
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const data = await postModel
      .find(query.criteria, query.options.fields)
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit);
    const total = await postModel.countDocuments(query.criteria);

    res.send({ total, links: query.links("/post", total), data });
  } catch (error) {
    next(createError(500, "fetching posts failed!"));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await postModel.findById(req.params.id);
    if (data) {
      res.send(data);
    } else {
      next(createError(404, "post not found!"));
    }
  } catch (error) {
    next(createError(500, "fetching requested post failed!"));
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (data) {
      res.send(data);
    } else {
      next(createError(404, "requested post not found!"));
    }
  } catch (error) {
    next(createError(500, "updating post failed!"));
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await postModel.findByIdAndDelete(req.params.id);
    if (data) {
      res.status(204).send("deleted");
    } else {
      next(createError(404, "post not found!"));
    }
  } catch (error) {
    next(createError(500, "deleting failed!"));
  }
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Linkedin-PostImages",
  },
});
router.post(
  "/:id/image",
  multer({ storage: cloudinaryStorage }).single("post"),
  async (req, res, next) => {
    try {
      const post = await postModel.findByIdAndUpdate(
        req.params.id,
        { postImage: req.file.path },
        { new: true }
      );

      if (post) {
        res.send(post);
      } else {
        next(createError(404, "post not found!"));
      }
    } catch (error) {
      next(createError(500, "updating post image failed!"));
    }
  }
);
export default router;
