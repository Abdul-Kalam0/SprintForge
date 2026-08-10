import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation.js";

import {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
} from "./project.controller.js";

const router = express.Router();

router.post(
  "/workspaces/:workspaceId/projects",
  authenticate,
  validate(createProjectSchema),
  createProject,
);

router.get("/workspaces/:workspaceId/projects", authenticate, getAllProjects);

router.get(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  getProject,
);

router.put(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  validate(updateProjectSchema),
  updateProject,
);

export default router;
