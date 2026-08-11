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
  getAvailableProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "./project.controller.js";

const router = express.Router();

// Create Project
router.post(
  "/workspaces/:workspaceId/projects",
  authenticate,
  validate(createProjectSchema),
  createProject,
);

// Get All Projects
router.get("/workspaces/:workspaceId/projects", authenticate, getAllProjects);

// Get Single Project
router.get(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  getProject,
);

// Update Project
router.put(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  validate(updateProjectSchema),
  updateProject,
);

// Get members available to add to project
router.get(
  "/workspaces/:workspaceId/projects/:projectId/members/available",
  authenticate,
  getAvailableProjectMembers,
);

// Add member to project
router.post(
  "/workspaces/:workspaceId/projects/:projectId/members",
  authenticate,
  addProjectMember,
);

// Remove member from project
router.delete(
  "/workspaces/:workspaceId/projects/:projectId/members/:userId",
  authenticate,
  removeProjectMember,
);

export default router;
