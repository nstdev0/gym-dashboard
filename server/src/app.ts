import express from "express";
import cors from "cors";
// import { testConnection } from "./database/test-connection";

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

// Test connection route
// app.get("/test", (req, res) => {
//   testConnection()
//     .then((result) => {
//       res.status(200).json({
//         success: true,
//         message: "Database connection successful",
//         result,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         success: false,
//         message: "Connection failed",
//         error: error instanceof Error ? error.message : error,
//       });
//     });
// });

app.use("/api/auth", authRouter);

// Routes
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
