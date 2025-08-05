import { Router } from "express";
import { RoleService } from "../services/role.service";

const router = Router();
const service = new RoleService();

router.get("/", async (req, res) => {
  const roles = await service.getAll();
  res.json(roles);
});

router.get("/:id", async (req, res) => {
  const role = await service.getById(Number(req.params.id));
  res.json(role);
});

router.post("/", async (req, res) => {
  const role = await service.create(req.body);
  res.status(201).json(role);
});

router.patch("/:id", async (req, res) => {
  const role = await service.update(Number(req.params.id), req.body);
  res.json(role);
});

router.delete("/:id", async (req, res) => {
  await service.delete(Number(req.params.id));
  res.status(204).send();
});

export default router;
