import foodModel from "../models/foodModel.js";
import { destroyImage, isImageDataUri, uploadImage } from "../lib/cloudinary.js";

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

/**
 * El admin manda la imagen como data URI en el JSON, no como multipart.
 * En Workers no hay disco donde escribir, así que multer no sirve: la imagen
 * va directa a Cloudinary y en Mongo se guarda la URL.
 */
const addFood = async (req, res) => {
  const { name, description, price, category, image } = req.body ?? {};
  try {
    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "Faltan datos de la artesanía" });
    }
    if (!isImageDataUri(image)) {
      return res.json({ success: false, message: "Falta la imagen o no es válida" });
    }

    const { url, publicId } = await uploadImage(image);

    await new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: url,
      imageId: publicId,
    }).save();

    res.json({ success: true, message: "Craft Added." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body?.id);
    if (!food) {
      return res.json({ success: false, message: "Craft not found" });
    }

    await destroyImage(food.imageId);
    await foodModel.findByIdAndDelete(food._id);

    res.json({ success: true, message: "Craft Removed." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { listFood, addFood, removeFood };
