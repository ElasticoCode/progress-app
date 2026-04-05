import express from "express";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ユーザー新規登録API
router.post("/register", validateRegister, registerUser);

// ユーザーログインAPI
router.post("/login", validateLogin, loginUser);

// 認証ミドルウェアを使用して、ログイン済みユーザーのみアクセス可能なルートの例
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "ログイン済みユーザー",
        user: req.user
    });
});

export default router;