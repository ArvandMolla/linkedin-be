import mongoose from "mongoose";

const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default: "https://picsum.photos/70/70",
    },
    username: { type: String, required: true, default: "admin" },
  },
  { timestamps: true }
);

export default model("Profile", profileSchema);
