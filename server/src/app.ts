import express from "express";
import cors from "cors";

import membersRouter from "./routes/members/member.routes";
import usersRouter from "./routes/users/user.routes";
import authRouter from "./routes/auth/auth.routes";

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

// 404 Not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

export default app;
