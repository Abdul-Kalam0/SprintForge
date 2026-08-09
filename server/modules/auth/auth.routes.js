import express from "express";
import validate from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import {
  getMe,
  login,
  logout,
  refreshToken,
  register,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/logout", authenticate, logout);
router.post("/auth/refresh-token", refreshToken);
router.get("/auth/me", authenticate, getMe);

export default router;
