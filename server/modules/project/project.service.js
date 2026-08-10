import ApiError from "../../shared/ApiError.js";
import WorkspaceModel from "../workspace/Workspace.model.js";
import ProjectModel from "./project.model.js";

export const createProjectService = async (userId, workspaceId, data) => {
  const { name, description, startDate, dueDate } = data;
  const existingWorkspace = await WorkspaceModel.findOne({
    owner: userId,
    _id: workspaceId,
  });
  if (!existingWorkspace) {
    throw new ApiError(404, "Workspace not found");
  }
  const project = await ProjectModel.create({
    name,
    description,
    startDate,
    dueDate,
    workspace: workspaceId,
  });

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    workspace: project.workspace,
  };
};

export const getAllProjectsService = async (userId, workspaceId) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const projects = await ProjectModel.find({
    workspace: workspaceId,
  });

  return projects;
};

export const getProjectService = async (userId, workspaceId, projectId) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }
  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  }).populate("workspace", "name description owner");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    workspace: {
      id: project.workspace._id,
      name: project.workspace.name,
      description: project.workspace.description,
      owner: project.workspace.owner,
    },
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

export const updateProjectService = async (
  userId,
  workspaceId,
  projectId,
  data,
) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }
  // 1. Find existing project
  const existingProject = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  // 2. Get final dates after update
  const startDate = data.startDate ?? existingProject.startDate;
  const dueDate = data.dueDate ?? existingProject.dueDate;

  // 3. Check date relationship
  if (new Date(dueDate) <= new Date(startDate)) {
    throw new ApiError(400, "Due date must be after start date");
  }

  const updatedProject = await ProjectModel.findOneAndUpdate(
    {
      _id: projectId,
      workspace: workspaceId,
    },
    data,
    {
      returnDocument: "after",
    },
  );
  if (!updatedProject) {
    throw new ApiError(404, "Project not found");
  }

  return {
    id: updatedProject._id,
    name: updatedProject.name,
    description: updatedProject.description,
    startDate: updatedProject.startDate,
    dueDate: updatedProject.dueDate,
    workspace: updatedProject.workspace,
    createdAt: updatedProject.createdAt,
    updatedAt: updatedProject.updatedAt,
  };
};
