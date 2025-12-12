import type { Request, Response } from "express";
import Task from "../models/Task";
import type { AuthRequest } from "../middleware/authMiddleware";

/**
 * CREATE TASK
 * -------------------------
 * This endpoint creates a new task for the logged-in user.
 * Steps:
 * 1. Extract user ID from the JWT-authenticated request (req.userId)
 * 2. Extract task fields from request body
 * 3. Create new Task document linked to this user
 * 4. Save to DB and return created task
 */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    // userId is added by authMiddleware after decoding JWT
    const userId = req.userId!;
    const { title, description, dateTime, deadline, priority } = req.body;

    // Create task document with reference to user
    const task = new Task({
      user: userId,
      title,
      description,
      dateTime,
      deadline,
      priority,
    });

    await task.save();

    res.json(task); // Return created task

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET ALL TASKS (FOR LOGGED-IN USER ONLY)
 * ---------------------------------------
 * Returns every task that belongs to the authenticated user.
 * Tasks are sorted by creation date (newest first).
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Find tasks that belong to this user, newest first
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * UPDATE TASK
 * -------------------------
 * Used for:
 * - Editing title/description/deadline/priority
 * - Marking task as completed or uncompleted
 *
 * Steps:
 * 1. Ensure the task belongs to the requesting user (userId match)
 * 2. Apply updates using findOneAndUpdate()
 * 3. Return updated task
 *
 * If task not found → return 404.
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Find task with matching ID AND user (authorization)
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId }, // ensures user can only update their tasks
      req.body,
      { new: true } // return the updated document
    );

    if (!task)
      return res.status(404).json({ message: "Not found" });

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * DELETE TASK
 * -------------------------
 * Removes a task only if:
 * - It exists
 * - It belongs to the authenticated user
 *
 * If deletion succeeds → return success message.
 * If no matching task is found → return 404.
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Delete task only if it belongs to the user
    const task = await Task.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!task)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
