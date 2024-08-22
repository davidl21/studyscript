import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  user_id: { type: String, required: true },
  docs: { type: Array, required: true },
  chatHistory: { type: Array, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
