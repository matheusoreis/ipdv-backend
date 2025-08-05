import { Router } from "express";
import { UserService } from "../services/user.service";

const router = Router();
const service = new UserService();

router.get("/", async (req, res) => {
  const users = await service.getAll();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await service.getById(Number(req.params.id));
  res.json(user);
});

router.patch("/:id", async (req, res) => {
  const user = await service.update(Number(req.params.id), req.body);
  res.json(user);
});

export default router;
