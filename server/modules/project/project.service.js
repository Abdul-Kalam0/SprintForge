import ApiError from "../../shared/ApiError.js";
import UserModel from "../auth/models/User.js";
import WorkspaceModel from "../workspace/Workspace.model.js";
import ProjectModel from "./project.model.js";

// Create Project
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
    members: [
      {
        user: userId,
        role: "admin",
      },
    ],
  });

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    workspace: project.workspace,
    members: project.members,
  };
};

// Get All Projects
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
  }).populate("members.user", "fullName email");

  return projects;
};

// Get Single Project
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
  })
    .populate("workspace", "name description owner")
    .populate("members.user", "fullName email");

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

    members: project.members,

    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

// Update Project
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

  const existingProject = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const startDate = data.startDate ?? existingProject.startDate;
  const dueDate = data.dueDate ?? existingProject.dueDate;

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
    members: updatedProject.members,
    createdAt: updatedProject.createdAt,
    updatedAt: updatedProject.updatedAt,
  };
};

// Get Available Project Members
export const getAvailableProjectMembersService = async (
  userId,
  workspaceId,
  projectId,
) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMemberIds = project.members.map((member) =>
    member.user.toString(),
  );

  const availableMemberIds = workspace.members
    .map((member) => member.user)
    .filter((memberId) => !projectMemberIds.includes(memberId.toString()));

  const users = await UserModel.find({
    _id: {
      $in: availableMemberIds,
    },
  }).select("fullName email");

  return users;
};

// Add Project Member
export const addProjectMemberService = async (
  userId,
  workspaceId,
  projectId,
  data,
) => {
  const { userId: memberUserId, role } = data;

  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const workspaceMember = workspace.members.find(
    (member) => member.user.toString() === memberUserId,
  );

  if (!workspaceMember) {
    throw new ApiError(400, "User is not a member of this workspace");
  }

  const existingMember = project.members.find(
    (member) => member.user.toString() === memberUserId,
  );

  if (existingMember) {
    throw new ApiError(409, "User is already a member of this project");
  }

  project.members.push({
    user: memberUserId,
    role,
  });

  await project.save();

  await project.populate({
    path: "members.user",
    select: "fullName email",
  });

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    workspace: project.workspace,
    members: project.members,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

// Remove Project Member
export const removeProjectMemberService = async (
  userId,
  workspaceId,
  projectId,
  memberUserId,
) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const memberIndex = project.members.findIndex(
    (member) => member.user.toString() === memberUserId,
  );

  if (memberIndex === -1) {
    throw new ApiError(404, "Project member not found");
  }

  const member = project.members[memberIndex];

  if (member.role === "admin") {
    throw new ApiError(400, "Project admin cannot be removed");
  }

  project.members.splice(memberIndex, 1);

  await project.save();

  await project.populate({
    path: "members.user",
    select: "fullName email",
  });

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    workspace: project.workspace,
    members: project.members,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};
