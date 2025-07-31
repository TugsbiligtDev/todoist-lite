import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user?.userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, projectId, dueDate } = req.body;
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ error: "title and projectId are required" });
    }
    const task = await prisma.task.create({
      data: { title, userId: req.user!.userId, projectId, dueDate },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate, projectId } = req.body;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task || task.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Task not found" });
    }
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, completed, dueDate, projectId },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task || task.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Task not found" });
    }
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
