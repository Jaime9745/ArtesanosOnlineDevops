import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { stripeSecretKey } from "../config.js";

/**
 * Stripe quedó desactivado (commit 73c79a2, "Deprecate JWT and Stripe secret
 * keys"). Los endpoints del flujo de pago con tarjeta responden 503 mientras
 * no haya una STRIPE_SECRET_KEY real; el pedido contra entrega sigue vivo.
 */
const stripeDisabled = (res) =>
  res.status(503).json({
    success: false,
    message: "El pago con tarjeta está desactivado. Usa contra entrega (COD).",
  });

const placeOrder = async (req, res) => {
  if (!stripeSecretKey()) return stripeDisabled(res);
  return res.status(503).json({
    success: false,
    message: "Hay clave de Stripe configurada pero la integración no está implementada.",
  });
};

const placeOrderCod = async (req, res) => {
  try {
    const { items, amount, address } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0 || !amount || !address) {
      return res.json({ success: false, message: "Faltan datos del pedido" });
    }

    await new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      payment: true,
    }).save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body ?? {};
    if (!orderId || !status) {
      return res.json({ success: false, message: "Faltan orderId o status" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

/**
 * Sólo tenía sentido como retorno de Stripe, y con `success=false` borraba el
 * pedido sin pedir credenciales. Cerrado junto con el resto del flujo.
 */
const verifyOrder = async (req, res) => stripeDisabled(res);

export { placeOrder, placeOrderCod, listOrders, userOrders, updateStatus, verifyOrder };
