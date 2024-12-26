import express from "express";
import Task from "../models/Task.model.js";
import { z } from "zod";
import authenticate from "../midddleware/middleware.js";

const taskRouter = express.Router();

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  status: z.boolean().default(false),
});

taskRouter.post("/create/tasks", authenticate, async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const parsedData = taskSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
    }

    const userId = req.user.userId;

    const newTask = new Task({
      title,
      description,
      status: status !== undefined ? status : false,
      user: req.user.userId,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

taskRouter.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId});
    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

taskRouter.put("/task/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status !== undefined ? status : task.status;

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

taskRouter.delete('/task/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default taskRouter;
