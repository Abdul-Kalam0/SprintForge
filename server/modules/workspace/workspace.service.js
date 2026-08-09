import ApiError from "../../shared/ApiError.js";
import WorkspaceModel from "./Workspace.model.js";

export const createWorkspaceService = async (userId, data) => {
  const { name, description } = data;
  const existingWorkspace = await WorkspaceModel.findOne({
    owner: userId,
    name,
  });
  if (existingWorkspace) {
    throw new ApiError(409, "Workspace already exists");
  }
  const newWorkspace = await WorkspaceModel.create({
    description,
    name,
    owner: userId,
  });

  return {
    workspace: {
      id: newWorkspace._id,
      name: newWorkspace.name,
      description: newWorkspace.description,
      owner: newWorkspace.owner,
    },
  };
};

export const getAllWorkspaceService = async (userId) => {
  const existingWorkspaces = await WorkspaceModel.find({
    owner: userId,
  })
    .select("name description owner createdAt updatedAt")
    .populate("owner", "fullName email");
  return existingWorkspaces;
};

export const getWorkspaceService = async (userId, workspaceId) => {
  const workspace = await WorkspaceModel.findOne({
    owner: userId,
    _id: workspaceId,
  })
    .select("name description createdAt updatedAt")
    .populate("owner", "fullName email");

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return {
    id: workspace._id,
    name: workspace.name,
    description: workspace.description,
    owner: {
      fullName: workspace.owner.fullName,
      email: workspace.owner.email,
    },
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};

export const updateWorkspaceService = async (userId, workspaceId, data) => {
  const { name, description } = data;

  const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
    {
      _id: workspaceId,
      owner: userId,
    },
    {
      name,
      description,
    },
    {
      returnDocument: "after",
    },
  );

  if (!updatedWorkspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return {
    id: updatedWorkspace._id,
    name: updatedWorkspace.name,
    description: updatedWorkspace.description,
    owner: updatedWorkspace.owner,
    createdAt: updatedWorkspace.createdAt,
    updatedAt: updatedWorkspace.updatedAt,
  };
};
