import ApiResponse from "../../shared/ApiResponse.js";
import ProjectModel from "./project.model.js";
import {
  createProjectService,
  getAllProjectsService,
  getProjectService,
  updateProjectService,
} from "./project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const project = await createProjectService(
      req.userId,
      req.params.workspaceId,
      req.body,
    );

    return res
      .status(201)
      .json(new ApiResponse({ project }, "Project created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjectsService(
      req.userId,
      req.params.workspaceId,
    );
    return res
      .status(200)
      .json(new ApiResponse({ projects }, "Projects fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await getProjectService(
      req.userId,
      req.params.workspaceId,
      req.params.projectId,
    );
    return res
      .status(200)
      .json(new ApiResponse({ project }, "Project fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await updateProjectService(
      req.userId,
      req.params.workspaceId,
      req.params.projectId,
      req.body,
    );
    return res
      .status(200)
      .json(new ApiResponse({ project }, "Project updated successfully"));
  } catch (error) {
    next(error);
  }
};

// Get available members
export const getAvailableProjectMembers = async (req, res, next) => {
  try {
    const users = await getAvailableProjectMembersService(
      req.userId,
      req.params.workspaceId,
      req.params.projectId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          { users },
          "Available project members fetched successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

// Add project member
export const addProjectMember = async (req, res, next) => {
  try {
    const project = await addProjectMemberService(
      req.userId,
      req.params.workspaceId,
      req.params.projectId,
      req.body,
    );

    return res
      .status(200)
      .json(new ApiResponse({ project }, "Project member added successfully"));
  } catch (error) {
    next(error);
  }
};

// Remove project member
export const removeProjectMember = async (req, res, next) => {
  try {
    const project = await removeProjectMemberService(
      req.userId,
      req.params.workspaceId,
      req.params.projectId,
      req.params.userId,
    );

    return res
      .status(200)
      .json(
        new ApiResponse({ project }, "Project member removed successfully"),
      );
  } catch (error) {
    next(error);
  }
};
