import mongoose from "mongoose";
import { requestScopedModel } from "../db/requestScopedModel.js";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  // URL absoluta de Cloudinary. Antes era el nombre del fichero en disco.
  image: { type: String, required: true },
  // `public_id` de Cloudinary, para poder borrar la imagen con el producto.
  imageId: { type: String },
  category: { type: String, required: true },
});

export default requestScopedModel("food", foodSchema);
