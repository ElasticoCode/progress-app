import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// タスク一覧取得API
router.get("/", authMiddleware, );

// タスク作成API
router.post("/", authMiddleware, );

export default router;