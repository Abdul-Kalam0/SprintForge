import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Auth
app.use("/api/v1", authRoutes);

//Workspace
app.use("/api/v1", workspaceRoutes);

//Project
app.use("/api/v1", projectRoutes);

//Task
app.use("/api/v1", taskRoutes);

app.use(errorHandler);

export default app;
