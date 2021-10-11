import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    profile: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      surname: { type: String, required: true },
      email: { type: String, required: true },
      bio: { type: String, required: true },
      title: { type: String, required: true },
      area: { type: String, required: true },
      image: { type: String },
      username: { type: String, required: true, default: "admin" },
    },
    postImage: {
      type: String,
      required: true,
      default: "https://picsum.photos/600/400",
    },
  },
  { timestamps: true }
);

export default model("Post", postSchema);
