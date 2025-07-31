import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ user: req.user });
};
