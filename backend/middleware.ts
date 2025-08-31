import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {User} from "./models/User.js"
interface JwtPayload {
    name: string;
  email: string;
}

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
if (!token) return res.status(401).json({ message: "No token, unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};
