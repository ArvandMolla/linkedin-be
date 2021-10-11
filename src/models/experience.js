import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, required: true },
    experienceArea: { type: String, required: true },
    experienceImage: {
      type: String,
      required: true,
      default: "https://picsum.photos/70/70",
    },
    username: { type: String, required: true, default: "admin" },
    profile: { type: Schema.Types.ObjectId, required: true, ref: "Profile" },
  },
  { timestamps: true }
);

export default model("Experience", experienceSchema);
