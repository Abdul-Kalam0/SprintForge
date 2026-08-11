import ApiError from "../../shared/ApiError.js";
import WorkspaceModel from "./Workspace.model.js";
import UserModel from "../auth/models/User.js";

// Create Workspace
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
    name,
    description,
    owner: userId,
    members: [
      {
        user: userId,
        role: "admin",
      },
    ],
  });

  return {
    workspace: {
      id: newWorkspace._id,
      name: newWorkspace.name,
      description: newWorkspace.description,
      owner: newWorkspace.owner,
      members: newWorkspace.members,
    },
  };
};

// Get All Workspaces
export const getAllWorkspaceService = async (userId) => {
  const existingWorkspaces = await WorkspaceModel.find({
    owner: userId,
  })
    .select("name description owner members createdAt updatedAt")
    .populate("owner", "fullName email")
    .populate("members.user", "fullName email");

  return existingWorkspaces;
};

// Get Workspace
export const getWorkspaceService = async (userId, workspaceId) => {
  const workspace = await WorkspaceModel.findOne({
    owner: userId,
    _id: workspaceId,
  })
    .select("name description owner members createdAt updatedAt")
    .populate("owner", "fullName email")
    .populate("members.user", "fullName email");

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
    members: workspace.members,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};

// Update Workspace
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
    members: updatedWorkspace.members,
    createdAt: updatedWorkspace.createdAt,
    updatedAt: updatedWorkspace.updatedAt,
  };
};

//All available members

export const getAvailableWorkspaceMembersService = async (
  userId,
  workspaceId,
) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const memberIds = workspace.members.map((member) => member.user);

  const users = await UserModel.find({
    _id: {
      $nin: [workspace.owner, ...memberIds],
    },
  }).select("fullName email");

  return users;
};

// Add Workspace Member
export const addWorkspaceMemberService = async (userId, workspaceId, data) => {
  const { userId: memberUserId, role } = data;

  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const user = await UserModel.findById(memberUserId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingMember = workspace.members.find(
    (member) => member.user.toString() === memberUserId,
  );

  if (existingMember) {
    throw new ApiError(409, "User is already a member of this workspace");
  }

  workspace.members.push({
    user: memberUserId,
    role,
  });

  await workspace.save();

  await workspace.populate([
    {
      path: "owner",
      select: "fullName email",
    },
    {
      path: "members.user",
      select: "fullName email",
    },
  ]);

  return {
    id: workspace._id,
    name: workspace.name,
    description: workspace.description,
    owner: workspace.owner,
    members: workspace.members,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};

// Remove Workspace Member
export const removeWorkspaceMemberService = async (
  userId,
  workspaceId,
  memberUserId,
) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const memberIndex = workspace.members.findIndex(
    (member) => member.user.toString() === memberUserId,
  );

  if (memberIndex === -1) {
    throw new ApiError(404, "Workspace member not found");
  }

  // Workspace owner cannot be removed
  if (workspace.owner.toString() === memberUserId) {
    throw new ApiError(400, "Workspace owner cannot be removed");
  }

  workspace.members.splice(memberIndex, 1);

  await workspace.save();

  await workspace.populate([
    {
      path: "owner",
      select: "fullName email",
    },
    {
      path: "members.user",
      select: "fullName email",
    },
  ]);

  return {
    id: workspace._id,
    name: workspace.name,
    description: workspace.description,
    owner: workspace.owner,
    members: workspace.members,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};
