import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCreateProject, validateProjectId, validateUpdateProject } from "../validators/projectValidator.js";
import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { createProject, deleteProject, updateProject } from "../controllers/projectController.js";

const router = express.Router();

// プロジェクト作成API
router.post("/projects", authMiddleware, validateCreateProject, handleValidationErrors, createProject);

// プロジェクト削除API
router.delete("/projects/:id", authMiddleware, validateProjectId, handleValidationErrors, deleteProject);

// プロジェクト更新API
router.put("/projects/:id", authMiddleware, validateProjectId, validateUpdateProject, handleValidationErrors, updateProject);

export default router;