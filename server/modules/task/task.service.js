import TaskModel from "./task.model.js";
import ProjectModel from "../project/project.model.js";
import ApiError from "../../shared/ApiError.js";

export const createTaskService = async (userId, projectId, data) => {
  const { title, description, startDate, dueDate } = data;

  // 1. Check if project exists and belongs to the user
  const project = await ProjectModel.findOne({
    _id: projectId,
  }).populate("workspace", "owner");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 2. Check workspace ownership
  if (project.workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this project");
  }

  // 3. Create task
  const task = await TaskModel.create({
    title,
    description,
    startDate,
    dueDate,
    project: projectId,
  });

  // 4. Return clean task data
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    startDate: task.startDate,
    dueDate: task.dueDate,
    project: task.project,
    assignee: task.assignee,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const getAllTasksService = async (userId, projectId) => {
  const project = await ProjectModel.findById(projectId).populate(
    "workspace",
    "owner",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this project");
  }

  const tasks = await TaskModel.find({
    project: projectId,
  });

  return tasks;
};

export const getTaskService = async (userId, projectId, taskId) => {
  const project = await ProjectModel.findById(projectId).populate(
    "workspace",
    "owner",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this project");
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return {
    id: task._id,
    title: task.title,
    description: task.description,
    startDate: task.startDate,
    dueDate: task.dueDate,
    project: task.project,
    assignee: task.assignee,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const updateTaskService = async (userId, projectId, taskId, data) => {
  const project = await ProjectModel.findById(projectId).populate(
    "workspace",
    "owner",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this project");
  }

  const existingTask = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  // Use the new date if provided, otherwise use the existing date.
  const startDate = data.startDate ?? existingTask.startDate;
  const dueDate = data.dueDate ?? existingTask.dueDate;

  if (new Date(dueDate) <= new Date(startDate)) {
    throw new ApiError(400, "Due date must be after start date");
  }

  const updatedTask = await TaskModel.findOneAndUpdate(
    {
      _id: taskId,
      project: projectId,
    },
    data,
    {
      returnDocument: "after",
    },
  );

  return {
    id: updatedTask._id,
    title: updatedTask.title,
    description: updatedTask.description,
    startDate: updatedTask.startDate,
    dueDate: updatedTask.dueDate,
    project: updatedTask.project,
    assignee: updatedTask.assignee,
    createdAt: updatedTask.createdAt,
    updatedAt: updatedTask.updatedAt,
  };
};
