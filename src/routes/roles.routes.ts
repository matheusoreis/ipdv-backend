import { Router } from "express";
import { RoleService } from "../services/role.service";

const router = Router();
const service = new RoleService();

router.get("/", (req, res) => {
  res.send("get");
});

router.post("/", (req, res) => {
  res.send("post");
});

router.patch("/", (req, res) => {
  res.send("patch");
});

router.delete("/", (req, res) => {
  res.send("delete");
});

export default router;
