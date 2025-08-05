import { Router } from "express";
import { UserService } from "../services/user.service";

const router = Router();
const service = new UserService();

router.get("/", (req, res) => {
  res.send("get");
});

router.post("/", (req, res) => {
  res.send("post");
});

router.patch("/", (req, res) => {
  res.send("patch");
});

export default router;
