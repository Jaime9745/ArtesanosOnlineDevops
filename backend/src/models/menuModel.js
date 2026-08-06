import mongoose from "mongoose";
import { requestScopedModel } from "../db/requestScopedModel.js";

const menuSchema = new mongoose.Schema({
  menu_name: { type: String, required: true },
  // URL absoluta de Cloudinary. Antes era el nombre del fichero en disco.
  menu_image: { type: String, required: true },
});

export default requestScopedModel("menu", menuSchema);
