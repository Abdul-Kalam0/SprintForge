import Joi from "joi";

const name = Joi.string().trim().min(2).max(100).required().messages({
  "string.empty": "Workspace name is required",
  "string.min": "Workspace name must be at least 2 characters",
  "string.max": "Workspace name must not exceed 100 characters",
  "any.required": "Workspace name is required",
});

const description = Joi.string()
  .trim()
  .max(500)
  .allow("")
  .default("")
  .messages({
    "string.max": "Description must not exceed 500 characters",
  });

const addWorkspaceMemberSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.hex": "User ID must be a valid ID",
    "string.length": "User ID must be a valid ID",
    "any.required": "User ID is required",
  }),

  role: Joi.string().valid("admin", "member").default("member").messages({
    "any.only": "Role must be either admin or member",
  }),
});

const createWorkspaceSchema = Joi.object({
  name,
  description,
});

const updateWorkspaceSchema = Joi.object({
  name: name.optional(),
  description: description.optional(),
});

export {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addWorkspaceMemberSchema,
};
