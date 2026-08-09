import express from "express";

import { authenticate } from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";

import {
  createWorkspace,
  getAllWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteAllWorkspace,
  deleteWorkspace,
} from "./workspace.controller.js";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
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

router.delete("/workspaces", authenticate, deleteAllWorkspace);

router.delete("/workspaces/:workspaceId", authenticate, deleteWorkspace);

export default router;
