import TaskModel from "./task.model.js";
import ProjectModel from "../project/project.model.js";
import ApiError from "../../shared/ApiError.js";

const checkProjectAccess = async (userId, projectId) => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isMember = project.members.some(
    (member) => member.user.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new ApiError(403, "You do not have access to this project");
  }

  return project;
};

const checkAssignee = (project, assignee) => {
  const isProjectMember = project.members.some(
    (member) => member.user.toString() === assignee.toString(),
  );

  if (!isProjectMember) {
    throw new ApiError(400, "Assignee must be a member of this project");
  }
};

export const createTaskService = async (userId, projectId, data) => {
  const { title, description, startDate, dueDate, status, assignee } = data;

  // 1. Check project access
  const project = await checkProjectAccess(userId, projectId);

  // 2. Check assignee
  checkAssignee(project, assignee);

  // 3. Create task
  const task = await TaskModel.create({
    title,
    description,
    startDate,
    dueDate,
    status,
    project: projectId,
    assignee,
  });

  // 4. Fetch populated task
  const populatedTask = await TaskModel.findById(task._id).populate(
    "assignee",
    "fullName email",
  );

  return {
    id: populatedTask._id,
    title: populatedTask.title,
    description: populatedTask.description,
    startDate: populatedTask.startDate,
    dueDate: populatedTask.dueDate,
    status: populatedTask.status,
    project: populatedTask.project,
    assignee: populatedTask.assignee,
    createdAt: populatedTask.createdAt,
    updatedAt: populatedTask.updatedAt,
  };
};

export const getAllTasksService = async (userId, projectId) => {
  // 1. Check project access
  await checkProjectAccess(userId, projectId);

  // 2. Get tasks with assignee details
  const tasks = await TaskModel.find({
    project: projectId,
  })
    .populate("assignee", "fullName email")
    .sort({ createdAt: -1 });

  return tasks;
};

export const getTaskService = async (userId, projectId, taskId) => {
  // 1. Check project access
  await checkProjectAccess(userId, projectId);

  // 2. Find task
  const task = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
  }).populate("assignee", "fullName email");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return {
    id: task._id,
    title: task.title,
    description: task.description,
    startDate: task.startDate,
    dueDate: task.dueDate,
    status: task.status,
    project: task.project,
    assignee: task.assignee,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const updateTaskService = async (userId, projectId, taskId, data) => {
  // 1. Check project access
  const project = await checkProjectAccess(userId, projectId);

  // 2. Find existing task
  const existingTask = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  // 3. Check assignee if being changed
  if (data.assignee) {
    checkAssignee(project, data.assignee);
  }

  // 4. Validate final dates
  const startDate = data.startDate ?? existingTask.startDate;

  const dueDate = data.dueDate ?? existingTask.dueDate;

  if (new Date(dueDate) <= new Date(startDate)) {
    throw new ApiError(400, "Due date must be after start date");
  }

  // 5. Update task
  const updatedTask = await TaskModel.findOneAndUpdate(
    {
      _id: taskId,
      project: projectId,
    },
    data,
    {
      returnDocument: "after",
    },
  ).populate("assignee", "fullName email");

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }

  return {
    id: updatedTask._id,
    title: updatedTask.title,
    description: updatedTask.description,
    startDate: updatedTask.startDate,
    dueDate: updatedTask.dueDate,
    status: updatedTask.status,
    project: updatedTask.project,
    assignee: updatedTask.assignee,
    createdAt: updatedTask.createdAt,
    updatedAt: updatedTask.updatedAt,
  };
};
