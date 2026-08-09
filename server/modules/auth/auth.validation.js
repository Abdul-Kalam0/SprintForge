import Joi from "joi";

const fullName = Joi.string().trim().min(2).max(100).required().messages({
  "string.empty": "Full name is required",
  "string.min": "Full name must be at least 2 characters",
  "string.max": "Full name must not exceed 100 characters",
  "any.required": "Full name is required",
});

const email = Joi.string()
  .trim()
  .lowercase()
  .email()
  .max(255)
  .required()
  .messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "string.max": "Email must not exceed 255 characters",
    "any.required": "Email is required",
  });

const password = Joi.string().min(8).max(128).required().messages({
  "string.empty": "Password is required",
  "string.min": "Password must be at least 8 characters",
  "string.max": "Password must not exceed 128 characters",
  "any.required": "Password is required",
});

const registerSchema = Joi.object({
  fullName,
  email,
  password,
});

const loginSchema = Joi.object({
  email,
  password,
});

export { registerSchema, loginSchema };
