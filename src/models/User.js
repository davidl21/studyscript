import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_id: { type: String, unique: true, required: true },
    docs: { type: Array, required: true },
    chatHistory: { type: Array, required: true },
    video_id: { type: String },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

export default User;
