import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import rolesRoutes from "./routes/roles.routes";
import usersRoutes from "./routes/users.routes";

export function bootstrap() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/users", usersRoutes);
  app.use("/api/roles", rolesRoutes);
  app.use("/api/auth", authRoutes);

  return app;
}
