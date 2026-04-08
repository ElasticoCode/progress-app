import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateCreateProject, validateProjectId, validateUpdateProject } from "../validators/projectValidator.js";
import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

// プロジェクト一覧取得API
router.get("/", authMiddleware, getProjects);

// プロジェクト作成API
router.post("/", authMiddleware, validateCreateProject, handleValidationErrors, createProject);

// プロジェクト更新API
router.put("/:id", authMiddleware, validateProjectId, validateUpdateProject, handleValidationErrors, updateProject);

// プロジェクト削除API
router.delete("/:id", authMiddleware, validateProjectId, handleValidationErrors, deleteProject);

export default router;