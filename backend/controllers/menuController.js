const menuModel = require("../models/menuModel");

// Obtener la lista de menús
const listMenu = async (req, res) => {
  try {
    const menus = await menuModel.find({});
    res.json({ success: true, data: menus });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

module.exports = { listMenu };