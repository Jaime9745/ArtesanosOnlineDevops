import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    menu_name: { type: String, required: true },
    menu_image: { type: String, required: true }
});

const menuModel = mongoose.models.menu || mongoose.model("menu", menuSchema);
export default menuModel;