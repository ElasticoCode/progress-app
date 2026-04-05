import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProject } from "../controllers/projectController.js";

const router = express.Router();

// プロジェクト作成API
router.post("/projects", authMiddleware, createProject);

export default router;