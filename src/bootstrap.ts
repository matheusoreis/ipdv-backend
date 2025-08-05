import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes";
import rolesRoutes from "./routes/roles.routes";
import usersRoutes from "./routes/users.routes";

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export function bootstrap() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", (req, res, next) =>
    asyncHandler(authRoutes)(req, res, next)
  );
  app.use("/api/users", (req, res, next) =>
    asyncHandler(usersRoutes)(req, res, next)
  );
  app.use("/api/roles", (req, res, next) =>
    asyncHandler(rolesRoutes)(req, res, next)
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      error: err.message || "Erro interno do servidor",
    });
  });

  return app;
}
