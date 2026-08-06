import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";

/**
 * El frontend manda el JWT en una cabecera `token` (contrato heredado); se
 * acepta también `Authorization: Bearer <token>`, que es lo estándar.
 */
const readToken = (req) => {
  if (req.headers.token) return req.headers.token;

  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);

  return null;
};

const authMiddleware = (req, res, next) => {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret());
    req.userId = decoded.id;
    // Los controladores heredados leen `req.body.userId`.
    if (req.body && typeof req.body === "object") {
      req.body.userId = decoded.id;
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authMiddleware;
