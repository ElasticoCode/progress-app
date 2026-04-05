import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProject, deleteProject, updateProjectName } from "../controllers/projectController.js";
import { validateCreateProject, validateUpdateProjectName } from "../validators/projectValidator.js";

const router = express.Router();

// プロジェクト作成API
router.post("/projects", authMiddleware, validateCreateProject, createProject);

// プロジェクト削除API
router.delete("/projects/:id", authMiddleware, deleteProject);

// プロジェクト名更新API
router.put("/projects/:id", authMiddleware, validateUpdateProjectName, updateProjectName);

export default router;