import Joi from "joi";

const name = Joi.string().trim().min(2).max(100).required().messages({
  "string.empty": "Project name is required",
  "string.min": "Project name must be at least 2 characters",
  "string.max": "Project name must not exceed 100 characters",
  "any.required": "Project name is required",
});

const description = Joi.string()
  .trim()
  .max(500)
  .allow("")
  .default("")
  .messages({
    "string.max": "Description must not exceed 500 characters",
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

const createProjectSchema = Joi.object({
  name,
  description,
  startDate,
  dueDate,
});

const updateProjectSchema = Joi.object({
  name: name.optional(),
  description: description.optional(),
  startDate: startDate.optional(),
  dueDate: dueDate.optional(),
});

const addProjectMemberSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.hex": "User ID must be a valid ID",
    "string.length": "User ID must be a valid ID",
    "any.required": "User ID is required",
  }),

  role: Joi.string().valid("admin", "member").default("member").messages({
    "any.only": "Role must be either admin or member",
  }),
});

export { createProjectSchema, updateProjectSchema, addProjectMemberSchema };
