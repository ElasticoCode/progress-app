import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCreateProject, validateProjectId, validateUpdateProject } from "../validators/projectValidator.js";
import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

// プロジェクト一覧取得API
router.get("/projects", authMiddleware, getProjects);

// プロジェクト作成API
router.post("/projects", authMiddleware, validateCreateProject, handleValidationErrors, createProject);

// プロジェクト更新API
router.put("/projects/:id", authMiddleware, validateProjectId, validateUpdateProject, handleValidationErrors, updateProject);

// プロジェクト削除API
router.delete("/projects/:id", authMiddleware, validateProjectId, handleValidationErrors, deleteProject);

export default router;