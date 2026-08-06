import mongoose from "mongoose";
import { requestScopedModel } from "../db/requestScopedModel.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false },
);

export default requestScopedModel("user", userSchema);
