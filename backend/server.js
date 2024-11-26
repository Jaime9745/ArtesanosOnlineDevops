const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const userRouter = require("./routes/userRoute.js");
const foodRouter = require("./routes/foodRoute.js");
const cartRouter = require("./routes/cartRoute.js");
const orderRouter = require("./routes/orderRoute.js");
const menuRouter = require("./routes/menuRoute.js");
require("dotenv").config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/menu", menuRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));