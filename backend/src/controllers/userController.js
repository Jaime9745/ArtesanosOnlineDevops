import jwt from "jsonwebtoken";
// bcryptjs (JS puro) en vez de bcrypt (addon nativo de C++): workerd no
// implementa N-API, así que no puede cargar binarios nativos. Los hashes $2b$
// son compatibles en ambos sentidos, no hay que rehashear nada.
import { compare, genSalt, hash } from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel.js";
import { jwtSecret } from "../config.js";

const createToken = (id) => jwt.sign({ id }, jwtSecret(), { expiresIn: "7d" });

const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};
  try {
    if (!email || !password) {
      return res.json({ success: false, message: "Faltan email o contraseña" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, token: createToken(user._id) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body ?? {};
  try {
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Faltan datos de registro" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const hashedPassword = await hash(password, await genSalt(10));
    const user = await new userModel({ name, email, password: hashedPassword }).save();

    res.json({ success: true, token: createToken(user._id) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
