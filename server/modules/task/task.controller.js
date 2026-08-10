import ApiError from "../../shared/ApiError.js";
import { createTaskService } from "./task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService(
      req.userId,
      req.params.projectId,
      req.body,
    );
    return res
      .status(201)
      .json(new ApiError({ project }, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasksService(req.userId, req.params.projectId);

    return res
      .status(200)
      .json(new ApiResponse({ tasks }, "Tasks fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await getTaskService(
      req.userId,
      req.params.projectId,
      req.params.taskId,
    );

    return res
      .status(200)
      .json(new ApiResponse({ task }, "Task fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService(
      req.userId,
      req.params.projectId,
      req.params.taskId,
      req.body,
    );

    return res
      .status(200)
      .json(new ApiResponse({ task }, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
};
