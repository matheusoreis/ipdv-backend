import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PayloadDto } from "../dtos/payload";

const SECRET_KEY = process.env.JWT_SECRET || "000000000000000";

export interface AuthRequest extends Request {
  user?: PayloadDto;
}

export function authenticateJwt(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error:
        "É necessário ter um token válido para continuar com a solicitação!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const payload = decoded as unknown;

    if (
      typeof payload === "object" &&
      payload !== null &&
      "sub" in payload &&
      "email" in payload &&
      "roleId" in payload
    ) {
      req.user = payload as PayloadDto;
      next();
    } else {
      return res.status(401).json({ error: "Token inválido." });
    }
  } catch (error) {
    return res.status(401).json({ error: "Token inválido." });
  }
}
