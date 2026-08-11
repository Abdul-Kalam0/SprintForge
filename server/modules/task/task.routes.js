import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";

import { createTaskSchema, updateTaskSchema } from "./task.validation.js";

import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
} from "./task.controller.js";

const router = express.Router();

// Create Task
router.post(
  "/projects/:projectId/tasks",
  authenticate,
  validate(createTaskSchema),
  createTask,
);

// Get All Tasks
router.get("/projects/:projectId/tasks", authenticate, getAllTasks);

// Get Single Task
router.get("/projects/:projectId/tasks/:taskId", authenticate, getTask);

// Update Task
router.put(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validate(updateTaskSchema),
  updateTask,
);

export default router;
