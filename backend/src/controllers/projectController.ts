import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user?.userId },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }
    const project = await prisma.project.create({
      data: { name, userId: req.user!.userId },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });
    if (!project || project.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Project not found" });
    }
    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });
    if (!project || project.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Project not found" });
    }
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
