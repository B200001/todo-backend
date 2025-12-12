import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);
router.post("/", createTask);
// router.get("/", getTasks);
console.log("Task routes loaded");
router.get("/", (req, res, next) => {
  console.log("GET /tasks hit"); // just to check
  next();
}, getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
