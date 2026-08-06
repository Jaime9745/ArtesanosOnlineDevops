import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// La imagen llega como data URI dentro del JSON: en Workers no hay disco, así
// que ya no hay multer ni carpeta `uploads`. Ver controllers/foodController.js.
foodRouter.get("/list", listFood);
foodRouter.post("/add", addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
