import app from "./app";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Start the server
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
