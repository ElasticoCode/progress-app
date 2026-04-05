import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

// プロジェクト作成API
router.post("/projects", authMiddleware, createProject);

// プロジェクト削除API
router.delete("/projects/:id", authMiddleware, deleteProject);

export default router;