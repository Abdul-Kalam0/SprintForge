import ApiError from "../../shared/ApiError.js";
import ApiResponse from "../../shared/ApiResponse.js";
import WorkspaceModel from "./Workspace.model.js";
import {
  createWorkspaceService,
  getAllWorkspaceService,
  getWorkspaceService,
  updateWorkspaceService,
} from "./workspace.service.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const { workspace } = await createWorkspaceService(req.userId, req.body);
    return res
      .status(201)
      .json(new ApiResponse({ workspace }, "Workspace created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllWorkspace = async (req, res, next) => {
  try {
    const workspaces = await getAllWorkspaceService(req.userId);
    return res
      .status(200)
      .json(new ApiResponse({ workspaces }, "Workspaces fetched successfully"));
  } catch (error) {
    next(error);
  }
};
export const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceService(
      req.userId,
      req.params.workspaceId,
    );
    return res
      .status(200)
      .json(new ApiResponse({ workspace }, "Workspace fetched successfully"));
  } catch (error) {
    next(error);
  }
};
export const updateWorkspace = async (req, res, next) => {
  try {
    const updatedWorkspace = await updateWorkspaceService(
      req.userId,
      req.params.workspaceId,
      req.body,
    );
    return res
      .status(200)
      .json(
        new ApiResponse({ updatedWorkspace }, "Workspace updated successfully"),
      );
  } catch (error) {
    next(error);
  }
};
export const deleteAllWorkspace = async (req, res, next) => {};

export const deleteWorkspace = async (req, res, next) => {};
