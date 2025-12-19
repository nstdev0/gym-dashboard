import express from "express";
import cors from "cors";

import authRouter from "./routes/auth/auth.routes";
import membersRouter from "./routes/members/member.routes";
import usersRouter from "./routes/users/user.routes";
import plansRouter from "./routes/plans/plan.routes";
import membershipRouter from "./routes/memberships/membership.routes";

import { verifyTokenMiddleware } from "./lib/api/jwt";

const app = express();

const whiteList = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: whiteList,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthy",
  });
});

// Auth routes (public)
app.use("/api/auth", authRouter);

// Protected routes
app.use("/api/members", verifyTokenMiddleware, membersRouter);
app.use("/api/users", verifyTokenMiddleware, usersRouter);
app.use("/api/plans", verifyTokenMiddleware, plansRouter);
app.use("/api/memberships", verifyTokenMiddleware, membershipRouter);

// 404 Not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Relationship Error Handler (just for now...)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global Error:", err);

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Constraint violation",
        message:
          "No se puede eliminar este registro porque tiene relaciones activas (ej. membresias, pagos).",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;
