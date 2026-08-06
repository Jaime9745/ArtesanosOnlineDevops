import cartRouter from "./cartRoute.js";
import foodRouter from "./foodRoute.js";
import menuRouter from "./menuRoute.js";
import orderRouter from "./orderRoute.js";
import userRouter from "./userRoute.js";

/**
 * Se monta dentro del primer request, no en el scope global: `bson` genera
 * bytes aleatorios en un static initializer y workerd prohíbe la aleatoriedad
 * y la I/O fuera de un contexto de request.
 */
export const setupRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/food", foodRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/menu", menuRouter);

  // El manejador de errores va al final: Express sólo propaga hacia los que
  // están DESPUÉS del punto donde saltó el error.
  app.use((err, _req, res, _next) => {
    console.error("Error no controlado:", err?.stack ?? err);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  });
};
