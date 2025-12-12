import express from "express";
// import { testConnection } from "./database/test-connection";

import membersRouter from "./routes/members/member.routes";

const app = express();

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

// Routes
app.use("/api/members", membersRouter);

// 404 Not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

export default app;
