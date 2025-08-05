import { Router } from "express";
import { AuthService } from "../services/auth.service";

const router = Router();
const service = new AuthService();

router.post("/signin", async (req, res) => {
  const result = await service.signIn(req.body);
  res.json(result);
});

router.post("/signup", async (req, res) => {
  const result = await service.signUp(req.body);
  res.json(result);
});

export default router;
