import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth/auth.routes";
import membersRouter from "./routes/members/member.routes";
import usersRouter from "./routes/users/user.routes";
import plansRouter from "./routes/plans/plan.routes";
import membershipRouter from "./routes/memberships/membership.routes";

import { verifyTokenMiddleware } from "./lib/api/jwt";
import { errorHandler } from "./interface-adapters/middlewares/error-handler.middleware";

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
app.use(morgan("dev"));

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
app.use("/api/members", membersRouter);
// app.use("/api/members", verifyTokenMiddleware, membersRouter);
app.use("/api/users", usersRouter);
app.use("/api/plans", plansRouter);
app.use("/api/memberships", membershipRouter);

// 404 Not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
