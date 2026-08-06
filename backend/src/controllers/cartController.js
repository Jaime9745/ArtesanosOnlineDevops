import userModel from "../models/userModel.js";

const loadCart = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return { user, cartData: user.cartData ?? {} };
};

const addToCart = async (req, res) => {
  try {
    const { cartData } = await loadCart(req.userId);
    const itemId = req.body.itemId;

    cartData[itemId] = (cartData[itemId] ?? 0) + 1;
    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { cartData } = await loadCart(req.userId);
    const itemId = req.body.itemId;

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      // A cero se quita la clave: si no, el carrito acumula ceros para siempre.
      delete cartData[itemId];
    }
    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const { cartData } = await loadCart(req.userId);
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
