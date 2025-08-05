import { Router } from "express";

const router = Router();

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
