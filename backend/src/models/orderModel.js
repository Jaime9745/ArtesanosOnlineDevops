import mongoose from "mongoose";
import { requestScopedModel } from "../db/requestScopedModel.js";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Processing" },
  // `Date.now` sin paréntesis: como valor por defecto mongoose lo llama en
  // cada inserción. Con `Date.now()` se congelaba la fecha del arranque.
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

export default requestScopedModel("order", orderSchema);
