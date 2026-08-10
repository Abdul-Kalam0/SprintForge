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

router.post(
  "/projects/:projectId/tasks",
  authenticate,
  validate(createTaskSchema),
  createTask,
);

router.get("/projects/:projectId/tasks", authenticate, getAllTasks);

router.get("/projects/:projectId/tasks/:taskId", authenticate, getTask);

router.put(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  validate(updateTaskSchema),
  updateTask,
);

export default router;
