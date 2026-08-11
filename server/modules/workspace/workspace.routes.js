import express from "express";

import { authenticate } from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";

import {
  createWorkspace,
  getAllWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  getAvailableWorkspaceMembers,
} from "./workspace.controller.js";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addWorkspaceMemberSchema,
} from "./workspace.validation.js";

const router = express.Router();

router.post(
  "/workspaces",
  authenticate,
  validate(createWorkspaceSchema),
  createWorkspace,
);

router.get("/workspaces", authenticate, getAllWorkspace);

router.get("/workspaces/:workspaceId", authenticate, getWorkspace);

router.put(
  "/workspaces/:workspaceId",
  authenticate,
  validate(updateWorkspaceSchema),
  updateWorkspace,
);

router.delete("/workspaces/:workspaceId", authenticate, deleteWorkspace);

// Workspace Members

router.get(
  "/workspaces/:workspaceId/members/available",
  authenticate,
  getAvailableWorkspaceMembers,
);

router.post(
  "/workspaces/:workspaceId/members",
  authenticate,
  validate(addWorkspaceMemberSchema),
  addWorkspaceMember,
);

router.delete(
  "/workspaces/:workspaceId/members/:userId",
  authenticate,
  removeWorkspaceMember,
);

export default router;
