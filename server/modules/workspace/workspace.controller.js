import ApiResponse from "../../shared/ApiResponse.js";

import {
  createWorkspaceService,
  getAllWorkspaceService,
  getWorkspaceService,
  updateWorkspaceService,
  addWorkspaceMemberService,
  removeWorkspaceMemberService,
  getAvailableWorkspaceMembersService,
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

export const getAvailableWorkspaceMembers = async (req, res, next) => {
  try {
    const users = await getAvailableWorkspaceMembersService(
      req.userId,
      req.params.workspaceId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          { users },
          "Available workspace members fetched successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const addWorkspaceMember = async (req, res, next) => {
  try {
    const workspace = await addWorkspaceMemberService(
      req.userId,
      req.params.workspaceId,
      req.body,
    );

    return res
      .status(200)
      .json(
        new ApiResponse({ workspace }, "Workspace member added successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const removeWorkspaceMember = async (req, res, next) => {
  try {
    const workspace = await removeWorkspaceMemberService(
      req.userId,
      req.params.workspaceId,
      req.params.userId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse({ workspace }, "Workspace member removed successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {};
