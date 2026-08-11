import Joi from "joi";

const title = Joi.string().trim().min(2).max(200).required().messages({
  "string.empty": "Task title is required",
  "string.min": "Task title must be at least 2 characters",
  "string.max": "Task title must not exceed 200 characters",
  "any.required": "Task title is required",
});

const description = Joi.string()
  .trim()
  .max(1000)
  .allow("")
  .default("")
  .messages({
    "string.max": "Description must not exceed 1000 characters",
  });

const startDate = Joi.date().required().messages({
  "date.base": "Start date must be a valid date",
  "any.required": "Start date is required",
});

const dueDate = Joi.date().greater(Joi.ref("startDate")).required().messages({
  "date.base": "Due date must be a valid date",
  "date.greater": "Due date must be after start date",
  "any.required": "Due date is required",
});

const status = Joi.string()
  .valid("todo", "in-progress", "completed", "cancelled")
  .default("todo")
  .messages({
    "any.only": "Status must be todo, in-progress, completed, or cancelled",
  });

const assignee = Joi.string().hex().length(24).required().messages({
  "string.hex": "Assignee must be a valid user ID",
  "string.length": "Assignee must be a valid user ID",
  "any.required": "Assignee is required",
});

const createTaskSchema = Joi.object({
  title,
  description,
  startDate,
  dueDate,
  status,
  assignee,
});

const updateTaskSchema = Joi.object({
  title: title.optional(),
  description: description.optional(),
  startDate: startDate.optional(),
  dueDate: dueDate.optional(),
  status: status.optional(),
  assignee: assignee.optional(),
});

export { createTaskSchema, updateTaskSchema };
