import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const app = express();
/**
 * MIDDLEWARE
 * -----------------------------------
 * cors() -> allows frontend to communicate with backend
 * express.json() -> parses incoming Json request bodies
 */
app.use(cors());
app.use(express.json());

/**
 * ROUTES
 * -----------------------------------
 * /api/auth-> user authentication(register, login)
 * /api/tasks -> CRUD operations for tasks (requires authMiddleware)
 */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
/**
 * PORT CONFIGURATION
 * -----------------------------------------
 * Use PORT from environment variables, otherwise fallback to 4000.
 */
const PORT = process.env.PORT || 4000;
/**
 * DATABASE CONNECTION + SERVER START
 * -----------------------------------------
 * mongoose.connect() tries to connect to MongoDB using the URI in .env.
 *
 * If connection succeeds:
 *  - Print "Mongo connected"
 *  - Start the server and listen for requests
 *
 * If connection fails:
 *  - Log the error
 *  - Exit the process (prevents server from running without DB)
 */

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/todo_app")
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log("Server running on", PORT));
  })
  .catch(err => {
    console.error("DB error", err);
    process.exit(1);
  });
